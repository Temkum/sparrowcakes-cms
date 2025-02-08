import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogCard({
  author = 'Admin',
  category = 'Snacks',
  title = 'Urna pretium elit mauris cursus at elit Vestibulum',
  image = '/placeholder.svg?height=300&width=400',
  date = { day: 10, month: 'OCT' },
  slug = '/',
}: BlogCardProps) {
  return (
    <Card className="max-w-md overflow-hidden group">
      <CardHeader className="p-4 space-y-2">
        <div className="text-sm text-muted-foreground">
          By {author} | {category}
        </div>
        <h3 className="font-semibold text-xl leading-tight">{title}</h3>
        <Link
          to={slug}
          className="text-emerald-500 hover:text-emerald-600 inline-flex items-center gap-2 text-sm font-medium"
        >
          Read More
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>

      <CardContent className="p-0 relative">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image || '/placeholder.svg?height=300&width=400'}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-4 right-4 bg-zinc-800 text-white px-3 py-2 text-center leading-tight">
            <div className="text-xl font-bold">{date.day}</div>
            <div className="text-sm uppercase">{date.month}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
