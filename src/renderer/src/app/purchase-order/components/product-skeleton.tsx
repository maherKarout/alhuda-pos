import React from 'react'
import { Box, Card, CardContent, Skeleton } from '@mui/material'

const ProductSkeleton = () => {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0',
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '120px',
        maxWidth: '200px',
        width: '173px',
        height: '147px'
      }}
    >
      {/* Color Border Skeleton */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '6px',
          height: '100%',
          backgroundColor: '#f5f5f5',
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px'
        }}
      />

      <CardContent sx={{ padding: '16px 16px 16px 22px' }}>
        {/* Product Name Skeleton */}
        <Skeleton
          variant="text"
          width="80%"
          height={20}
          sx={{
            marginBottom: '8px',
            borderRadius: '4px'
          }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={16}
          sx={{
            marginBottom: '8px',
            borderRadius: '4px'
          }}
        />

        {/* Price Skeleton */}
        <Skeleton
          variant="text"
          width="50%"
          height={16}
          sx={{
            marginBottom: '4px',
            borderRadius: '4px'
          }}
        />

        {/* Quantity Skeleton */}
        <Skeleton
          variant="text"
          width="40%"
          height={14}
          sx={{
            marginBottom: '8px',
            borderRadius: '4px'
          }}
        />

        {/* Quantity Controls Skeleton */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '16px',
            gap: '8px'
          }}
        >
          {/* Decrement Button Skeleton */}
          {/* <Skeleton variant="circular" width={32} height={32} /> */}

          {/* Quantity Display Skeleton */}
          {/* <Skeleton
            variant="text"
            width={20}
            height={20}
            sx={{
              borderRadius: '4px'
            }}
          /> */}

          {/* Increment Button Skeleton */}
          {/* <Skeleton variant="circular" width={32} height={32} /> */}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductSkeleton
