import React, { useState } from 'react';
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
} from '@mui/material';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import { useCart } from '@/hooks/userCarts';

type Product = {
  id: string;
  productId:string,
  productName: { product: string,id:string };
  price: number;
  discountPrice?: number;
  productProfile: string;
  marketName: string;
  rating?: number;
};

type ProductCardProps = {
  product: Product;
  layout: 'grid' | 'list';
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout }) => {
  const [userRating, setUserRating] = useState<number>(product.rating ?? 0);
  const { addToCart } = useCart();

  const hasDiscount =
    typeof product.discountPrice === 'number' &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.discountPrice ?? 0)) / product.price) * 100)
    : 0;

  console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::::",product)
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
            unit: Unit,
            unitPrice: unitPrice,
            totalPrice: unitPrice,
          },
          totalAmount: unitPrice,
        };

        addToCart.mutate(item);
      };

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
          {product.productName.product}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          noWrap
          title={product.shopName.market.marketName}
          fontStyle="italic"
        >
          {product.shopName.market.marketName} - {product.shopName.brandName}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: layout === 'list' ? 'flex-start' : 'center', alignItems: 'center', mt: 0.5 }}>
          <Rating
            name={`rating-${product.id}`}
            value={userRating}
            precision={0.5}
            onChange={(_event, newValue) => {
              if (newValue !== null) setUserRating(newValue);
            }}
            size="small"
            sx={{ color: 'primary.main' }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
            {userRating.toFixed(1)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: layout === 'list' ? 'flex-start' : 'center', gap: 1, alignItems: 'center', mt: 0.5 }}>
          {!hasDiscount ? (
            <>
              <Typography variant="h6" color="error" fontWeight="bold">
                {(product.discountPrice ?? 1000)} RWF
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {product.price || 2000}  RWF
              </Typography>
            </>
          ) : (
            <Typography variant="h6" fontWeight="bold">
              {product.price || 2000} RWF
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={2} justifyContent={layout === 'list' ? 'flex-start' : 'center'} sx={{ mt:1 }}>
          <Tooltip title="Add to wishlist">
            <IconButton size="small" color="error">
              <FavoriteBorderIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add to cart">
            <IconButton size="small" color="primary">
              <ShoppingCartOutlinedIcon onClick={()=>handleCartItem({ 
                  productId: product.id, 
                  Unit: "kg", 
                  unitPrice: 2000 
                })} />
            </IconButton>
          </Tooltip>

          <Tooltip title="View details">
            <IconButton size="small" color="info">
              <VisibilityOutlinedIcon />
            </IconButton>
          </Tooltip>

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
