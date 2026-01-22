import React, { useContext, useState } from 'react';
import {useRouter} from "next/navigation"
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Rating,
  Stack,
  Button,
} from '@mui/material';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

// import { useCart } from '@/hooks/userCarts';
import { Bold } from 'lucide-react';
import { AuthContext } from '@/context/auth-context';
import { useCart } from '@/hooks/userCarts';

type Product = {
  id: string;
  productId:string,
  productName: { product: string,id:string };
  marketUnitPrice: number;
  productDiscount ?: number;
  productProfile: string;
  productUnit:string,
  unitProduct:{id:string, unitProduct:string}
  engLabel:string;
  marketName: string;
  rating?: number;
};

type ProductCardProps = {
  product: Product;
  layout: 'grid' | 'list';
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout }) => {
  const router=useRouter()
  const [userRating, setUserRating] = useState<number>(product.rating ?? 0);
 
 const [selectedUnit, setSelectedUnit] = useState(null);

  const {user,isAuthenticated } = useContext(AuthContext)!;
  const isBuyer = String(user?.role.role || "").toLowerCase() === "buyer";

   const { addToCart } = useCart({
      enabled: isBuyer && isAuthenticated,
    });
  

  const handleSelect = (item) => {
    setSelectedUnit(item);
    console.log("Selected:", item);
  };
 
  const hasDiscount = Number(product.productDiscount)  > 0 &&
    Number(product.productDiscount)  < Number(product.marketUnitPrice);

  const discountPercent = hasDiscount
    ? Math.round(((product.marketUnitPrice - (product.productDiscount  ?? 0)) / product.marketUnitPrice) * 100)
    : 0;

    console.log("product========================",product)

    const handleCartItem = ({
        productId,
        Unit,
        unitPrice,
      }: {
        productId: string;
        Unit: string | null;
        unitPrice: number;
      }) => {
          const item = {
          items: {
            productId,
            quantity: 1,
            unit:Unit,
            unitPrice:Number(unitPrice),
            totalPrice:Number(unitPrice),
          },
          totalAmount:Number(unitPrice),
        };

        addToCart.mutate(item);
      };

      const  handleProductDetail=(id:string)=>{
        router.push(`/products/${id}`)
      }

  return (
    <Card
      sx={{
        display: layout === 'list' ? 'flex' : 'block',
        p:1,
        borderRadius: 3,
        boxShadow:0,
        maxWidth: layout === 'grid' ? 300 : '95%',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          boxShadow:2,
          transform: 'scale(1.03)',
        },
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={product.productProfile}
          alt={product.productName.product}
          sx={{
            width: layout === 'list' ? 160 : '100%',
            height: layout === 'list' ? 140 : 170,
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            borderRadius: 2,
          }}
          loading="lazy"
        />

        {hasDiscount && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'error.main',
              color: 'white',
              px: 1.2,
              py: 0.4,
              borderRadius: 1,
              fontWeight: 'bold',
              fontSize: 12,
              boxShadow: 1,
              animation: 'pulse 2s infinite',
              userSelect: 'none',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.7 },
              },
            }}
          >
            {discountPercent}% OFF
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          ml: layout === 'list' ? 3 : 0,
          mt: layout === 'list' ? 0 : 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: layout === 'list' ? 'left' : 'center',
          gap: 0.2,
          px: 0,
          py:0.5,
        }}
      >
        <Typography variant="h6" noWrap title={product.productName.product} fontWeight={700} fontSize={18}>
          {product.productName.product} ~ {product.engLabel}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          noWrap
          title={product.shopName.market.marketName}
          fontStyle="italic"
        >
          {product.shopName.market.marketName} 
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: layout === 'list' ? 'flex-start' : 'center', alignItems: 'center', mt: 0.5 }}>
          <Rating
            name={`rating-${product.id}`}
            value={5}
            precision={0.5}
            
            size="small"
            sx={{ color: 'primary.main' }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
            {userRating.toFixed(1)}
          </Typography>
        </Box>

       <Box
        sx={{
          display: "flex",
          justifyContent: layout === "list" ? "flex-start" : "center",
          gap: 1,
          alignItems: "center",
          mt: 0.5,
        }}
      >
        {hasDiscount ? (
          <>
         
            <Typography variant="h6" color="error" fontWeight="bold">
              {(product.productDiscount ?? product.marketUnitPrice) || 0} RWF /{" "}
              {product.unitProduct?.unitProduct}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              {product.marketUnitPrice || product.productDiscount} RWF /{" "}
              {product.unitProduct?.unitProduct}
            </Typography>
          </>
        ) : product.productUnities?.length >1 ? (
         
        <Typography
          variant="subtitle2"
          color="text.primary"
          noWrap
          title={"Available in different Option"}
          fontStyle="italic"
          fontWeight="bold"
        >
          {"Available in different Option"} 
        </Typography>

        ) : (
          product.productUnities?.map((item, index) => (
            <Typography key={index} variant="h6" fontWeight="bold">
              {item.unitPrice || 0} RWF / {item.subUnit?.subUnit}
            </Typography>
          ))
        )}
      </Box>


        <Stack direction="row" spacing={2} justifyContent={layout === 'list' ? 'flex-start' : 'center'} sx={{ mt:1 }}>
          <Tooltip title="Add to wishlist">
            <IconButton size="small" color="error">
              <FavoriteBorderIcon />
            </IconButton>
          </Tooltip>
           { product.productUnities?.length >1 ? (
            <>
              <Tooltip title="Available in different option please select" >
                <Button variant="contained" size="small" onClick={()=>{
                handleProductDetail(product.id)
              }}  >Select</Button>
              </Tooltip>
            </>
            
           ):(
           <>
            <Tooltip title="Add to cart">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => {
                handleCartItem({
                  productId: product.id,
                  Unit: product.productUnities?.[0]?.subUnit?.subUnit || "N/A",
                  unitPrice: product.productUnities?.[0]?.unitPrice || 0,
                });
                
                //alert(product.productUnities?.[0]?.subUnit?.subUnit || "No unit available");
              }}
            >
              <ShoppingCartOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View details">
            <IconButton size="small" color="info">
              <VisibilityOutlinedIcon onClick={()=>{
                handleProductDetail(product.id)
              }} />
            </IconButton>
          </Tooltip>
           </>
           )}

          {/* <Tooltip title="Like">
            <IconButton size="small" color="success">
              <ThumbUpOffAltIcon />
            </IconButton>
          </Tooltip> */}
        </Stack>
      </CardContent>
    </Card>
  );
};
