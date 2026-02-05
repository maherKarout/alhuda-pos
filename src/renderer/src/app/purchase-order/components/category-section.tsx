import GridViewIcon from '@mui/icons-material/GridView'
import { Box, Button, Stack, styled, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
// Swiper imports
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import usePurchaseOrder from '../hooks/use-purchase-order'
import { useGetAllCategoriesForPurchaseOrderQuery } from '../services/api'
import generateRandomColor from '../utils/genreate-random-color'
import { isBackgroundColorDark } from '../utils/get-color-by-background-color'

// Custom Swiper styles for categories
const categorySwiperStyles = {
  '& .swiper-button-next, & .swiper-button-prev': {
    color: '#1976d2 !important',
    width: '30px !important',
    height: '30px !important',
    marginTop: '-15px !important',
    '&:after': {
      fontSize: '16px !important'
    }
  },
  '& .swiper-button-disabled': {
    opacity: '0.3 !important'
  },
  '& .swiper-button-prev': {
    left: '10px !important'
  },
  '& .swiper-button-next': {
    right: '10px !important'
  }
}

// Styled components
const CategoryCard = styled(Box)<{ bgColor: string; isSelected?: boolean }>(
  ({ bgColor, isSelected }) => ({
    backgroundColor: isSelected ? '#1976d2' : bgColor,
    borderRadius: '12px',
    padding: '20px',
    height: '75px',
    minWidth: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    cursor: 'pointer',
    // opacity: 0.8,
    transition: 'all 0.3s ease',
    border: isSelected ? '3px solid #fff' : 'none',
    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
    }
  })
)

const ViewAllButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  padding: '8px 24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white'
  }
}))

interface CategorySectionProps {
  onViewAll?: () => void
}

const CategorySection = ({ onViewAll }: CategorySectionProps) => {
  const { t } = useTranslation('translation')
  const { data, isFetching } = useGetAllCategoriesForPurchaseOrderQuery()
  const { selectedCategory, setSelectedCategory } = usePurchaseOrder()

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory?.(categoryId.toString())
  }

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll()
    }
  }

  return (
    <Box sx={{ padding: '0', paddingBottom: '0px' }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: '24px' }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            fontSize: { xs: '16px', md: '24px' }
          }}
        >
          Choose Category
        </Typography>

        <ViewAllButton variant="text" onClick={handleViewAllClick}>
          View All
        </ViewAllButton>
      </Stack>

      <Box sx={{ position: 'relative', paddingBottom: '24px', ...categorySwiperStyles }}>
        <Swiper
          // modules={[Navigation]}
          spaceBetween={16}
          slidesPerView="auto"
          // navigation={true}
          breakpoints={{
            320: {
              slidesPerView: 1.5,
              spaceBetween: 12
            },
            640: {
              slidesPerView: 2.5,
              spaceBetween: 16
            },
            768: {
              slidesPerView: 3.5,
              spaceBetween: 16
            },
            1024: {
              slidesPerView: 4.5,
              spaceBetween: 16
            },
            1280: {
              slidesPerView: 5.5,
              spaceBetween: 16
            }
          }}
        >
          {/* Show All Categories Box */}
          <SwiperSlide style={{ width: 'auto', minWidth: '150px' }}>
            <CategoryCard
              bgColor={'#08468E'}
              isSelected={!selectedCategory}
              onClick={() => setSelectedCategory?.('')}
              sx={{
                justifyContent: 'space-between'
              }}
            >
              <GridViewIcon
                sx={{
                  color: 'white',
                  fontSize: 32,
                  marginBottom: '12px',
                  marginLeft: 'auto'
                }}
              />

              {/* Category Name */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '8px',
                    fontSize: { xs: '11px', md: '14px' }
                  }}
                >
                  {t('All Categories')}
                </Typography>

                {/* Item Count */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '14px'
                  }}
                >
                  All items
                </Typography>
              </Box>
            </CategoryCard>
          </SwiperSlide>

          {data?.data.map((category, index) => (
            // {categoriesData.map((category, index) => (
            <SwiperSlide key={category.id} style={{ width: 'auto', minWidth: '150px' }}>
              <CategoryCard
                // bgColor={generateRandomColor()}
                // bgColor={category.color}
                bgColor={'#D9D9D9'}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
                sx={
                  {
                    // justifyContent: category.icon ? "space-between" : "flex-end",
                  }
                }
              >
                {/* Category Name */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={(theme) => ({
                      color:
                        theme.palette.mode !== 'dark' &&
                        isBackgroundColorDark(generateRandomColor())
                          ? theme.palette.grey[100]
                          : theme.palette.grey[900],
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: '8px',
                      fontSize: { xs: '11px', md: '14px' }
                    })}
                  >
                    {category.name === 'All Categories' ? t('All Categories') : category.name}
                  </Typography>

                  {/* Item Count */}
                  <Typography
                    variant="body2"
                    sx={(theme) => ({
                      color:
                        theme.palette.mode !== 'dark' &&
                        isBackgroundColorDark(generateRandomColor())
                          ? theme.palette.grey[100]
                          : theme.palette.grey[900],
                      textAlign: 'center',
                      fontSize: '14px'
                    })}
                  >
                    {category.productsCount || 0} items
                  </Typography>
                </Box>
              </CategoryCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  )
}

export default CategorySection
