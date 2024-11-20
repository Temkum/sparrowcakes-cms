import { useState } from 'react';
import { Box, Tabs, Tab, Typography, styled } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette}`,
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 800,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '4px',
  padding: '12px 24px',
  margin: '0px 4px 5px 0px',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s',

  '&:hover': {
    backgroundColor: '#5caf90',
    color: '#fff',
  },

  '&.Mui-selected': {
    backgroundColor: '#5caf90',
    color: '#fff',
  },
}));

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
  >
    {value === index && (
      <Box
        sx={{
          p: 2,
          border: '1px solid lightgray',
          borderRadius: 2,
        }}
      >
        <Typography component="div">{children}</Typography>
      </Box>
    )}
  </div>
);

const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

export default function SingleProductTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Box>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="product tabs"
        >
          <StyledTab label="Detail" {...a11yProps(0)} />
          <StyledTab label="Specifications" {...a11yProps(1)} />
          <StyledTab label="Vendor" {...a11yProps(2)} />
          <StyledTab label="Reviews" {...a11yProps(3)} />
        </StyledTabs>
      </Box>

      <TabPanel value={value} index={0}>
        <div>
          <Typography component="p">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Any Product types that You want - Simple, Configurable</li>
            <li>Downloadable/Digital Products, Virtual Products</li>
            <li>Inventory Management with Back ordered items</li>
            <li>Flatlock seams throughout.</li>
          </Box>
        </div>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Box sx={{ '& span': { fontWeight: 'bold', mr: 1 } }}>
          <Typography component="p">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', pl: 0 }}>
            <li>
              <span>Model:</span> SKU140
            </li>
            <li>
              <span>Weight:</span> 500 g
            </li>
            <li>
              <span>Dimensions:</span> 35 × 30 × 7 cm
            </li>
            <li>
              <span>Color:</span> Black, Pink, Red, White
            </li>
            <li>
              <span>Size:</span> 10 X 20
            </li>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Ocean Crate
          </Typography>
          <Typography>Products: 358</Typography>
          <Typography component="p">Sales: 5587</Typography>
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              pl: 0,
              '& span': { fontWeight: 'bold', mr: 1 },
            }}
          >
            <li>
              <span>Phone No.:</span> +00 987654321
            </li>
            <li>
              <span>Email:</span> Example@gmail.com
            </li>
            <li>
              <span>Address:</span> 2548 Broaddus Maple Court, Madisonville KY
              4783, USA
            </li>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Mariya Lykra
            </Typography>
            <Typography>⭐⭐⭐⭐☆</Typography>
            <Typography>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Moris Willson
            </Typography>
            <Typography>⭐⭐⭐☆☆</Typography>
            <Typography>
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen.
            </Typography>
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
}
