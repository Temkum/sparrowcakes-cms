import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Loader2,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
} from 'lucide-react';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import AddOfferForm from './AddOfferForm';
import { Offer } from '@/types/offer';
import useOffersStore from '@/store/offer-store';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/auth';
import offerService from '@/services/offer-service';
import { Badge } from '@/components/ui/badge';
import { useFormatCurrency } from '@/hooks/format-currency';

const Offers = () => {
  const formatCurrency = useFormatCurrency();
  const {
    offers,
    loading,
    filter,
    setFilter,
    loadOffers,
    totalCount,
    createOffer,
    updateOffer,
  } = useOffersStore();

  const [open, setOpen] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const [searchValue, setSearchValue] = useState(filter.searchTerm || '');
  const debouncedSearch = useDebounce(searchValue, 400);

  useEffect(() => {
    setFilter({ searchTerm: debouncedSearch, page: 1 });
  }, [debouncedSearch, setFilter]);

  useEffect(() => {
    loadOffers();
  }, [filter, loadOffers]);

  const pageSize = filter.limit || 10;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleEditOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && offers) {
      setSelectedOffers(offers.map((o) => o.id));
    } else {
      setSelectedOffers([]);
    }
  };

  const handleSelectOffer = (offerId: number, checked: boolean) => {
    if (checked) {
      setSelectedOffers([...selectedOffers, offerId]);
    } else {
      setSelectedOffers(selectedOffers.filter((id) => id !== offerId));
    }
  };

  const handleExport = () => {
    if (selectedOffers.length === 0) return;

    const offersToExport = offers?.filter(
      (o) => o && selectedOffers.includes(o.id)
    );

    if (!offersToExport || offersToExport.length === 0) return;

    const csvData = offersToExport.map((o) => ({
      name: o.name,
      product_id: o.productId,
      discount_type: o.discountType,
      discount_value: o.discountValue,
      start_time: o.startTime ? format(new Date(o.startTime), 'PP') : '',
      end_time: o.endTime ? format(new Date(o.endTime), 'PP') : '',
      created_at: o.createdAt ? format(new Date(o.createdAt), 'PP') : '',
    }));

    const csvString = [
      Object.keys(csvData[0]).join(';'),
      ...csvData.map((row) => Object.values(row).join(';')),
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offers-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteSelected = async () => {
    if (selectedOffers.length === 0) return;

    try {
      const { token } = useAuthStore.getState();

      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }

      // Delete each selected offer
      await Promise.all(
        selectedOffers.map((id) =>
          offerService.deleteOffer(id).catch((err) => {
            console.error(`Error deleting offer ${id}:`, err);
            throw err;
          })
        )
      );

      toast.success('Selected offers deleted successfully');
      setSelectedOffers([]);
      loadOffers();
    } catch (error) {
      console.error('Error deleting offers:', error);
      toast.error('Failed to delete selected offers');
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilter({ ...filter, page: newPage });
  };

  const breadcrumbItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Offers', href: '#' },
    ],
    []
  );

  // Reset selected offer when closing the form
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedOffer(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (
    formData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      if (selectedOffer) {
        // Update existing offer
        const updatedOffer: Offer = {
          ...selectedOffer,
          ...formData,
          updatedAt: new Date(),
        };
        await updateOffer(updatedOffer);
        toast.success('Offer updated successfully');
      } else {
        // Create new offer - create a complete offer object with default values
        const newOffer: Offer = {
          ...formData,
          id: 0, // This will be set by the server
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await createOffer(newOffer);
        toast.success('Offer created successfully');
      }

      // Refresh the offers list
      loadOffers();

      // Close the form
      setOpen(false);
      setSelectedOffer(null);
    } catch (error) {
      console.error('Error saving offer:', error);
      toast.error(`Failed to ${selectedOffer ? 'update' : 'create'} offer`);
    }
  };

  // Check if offer is currently active
  const isOfferActive = (offer: Offer) => {
    const now = new Date();
    const startTime = offer.startTime ? new Date(offer.startTime) : null;
    const endTime = offer.endTime ? new Date(offer.endTime) : null;
    if (!startTime || !endTime) return false;
    return now >= startTime && now <= endTime && offer.isActive;
  };

  // Check if offer is expired
  const isOfferExpired = (offer: Offer) => {
    const now = new Date();
    const endTime = offer.endTime ? new Date(offer.endTime) : null;
    if (!endTime) return false;
    return now > endTime;
  };

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="w-full p-6 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Offers</h1>
        </div>

        {/* Global Search and Actions */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-[400px] bg-white">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search offers..."
              className="pl-10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          {filter.searchTerm && (
            <Button
              onClick={() =>
                setFilter({
                  searchTerm: '',
                  page: 1,
                  limit: 10,
                  sortBy: 'created_at',
                  sortDirection: 'DESC',
                })
              }
            >
              Clear filter
            </Button>
          )}
          {selectedOffers.length > 0 && (
            <>
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                className="flex items-center gap-2"
              >
                <span>Delete Selected ({selectedOffers.length})</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export ({selectedOffers.length})
              </Button>
            </>
          )}
          <div className="ml-auto">
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setOpen(true)}
            >
              New offer
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="h-9 bg-slate-200">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      offers &&
                      offers.length > 0 &&
                      selectedOffers.length === offers.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Discount Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : !offers || offers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No offers found
                  </TableCell>
                </TableRow>
              ) : (
                offers.map((offer: Offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOffers.includes(offer.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOffer(offer.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={offer.image_url || '/placeholder.svg'}
                        alt={offer.name}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/placeholder.svg';
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{offer.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {offer.discountType === 'percentage'
                          ? 'Percentage'
                          : 'Fixed Amount'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {offer.discountType === 'percentage'
                        ? `${offer.discountValue}%`
                        : formatCurrency(offer.discountValue || 0)}
                    </TableCell>
                    <TableCell>
                      {offer.startTime
                        ? format(new Date(offer.startTime), 'PP p')
                        : ''}
                    </TableCell>
                    <TableCell>
                      {offer.endTime
                        ? format(new Date(offer.endTime), 'PP p')
                        : ''}
                    </TableCell>
                    <TableCell>
                      {isOfferExpired(offer) ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : isOfferActive(offer) ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Scheduled</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOffer(offer);
                        }}
                        aria-label={`Edit ${offer.name}`}
                        className="hover:bg-orange-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {offers && offers.length > 0 && (
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">
                Showing {((filter.page || 1) - 1) * pageSize + 1} to{' '}
                {Math.min((filter.page || 1) * pageSize, totalCount)} of{' '}
                {totalCount} results
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm">Rows per page</p>
                <Select
                  value={filter.limit?.toString() || '10'}
                  onValueChange={(value) => {
                    setFilter({ ...filter, limit: Number(value), page: 1 });
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={filter.limit || 10} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 50, 100].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {filter.page} of {totalPages}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => handlePageChange(1)}
                  disabled={filter.page === 1}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange((filter.page || 1) - 1)}
                  disabled={filter.page === 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange((filter.page || 1) + 1)}
                  disabled={(filter.page || 1) >= totalPages}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={(filter.page || 1) >= totalPages}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Offer Form */}
        <AddOfferForm
          open={open}
          onOpenChange={handleOpenChange}
          mode={selectedOffer ? 'edit' : 'create'}
          offer={selectedOffer || undefined}
          onSubmit={handleSubmit}
          onSuccess={() => {
            loadOffers();
            setSelectedOffer(null);
            setOpen(false);
          }}
        />
      </div>
    </>
  );
};

export default Offers;
