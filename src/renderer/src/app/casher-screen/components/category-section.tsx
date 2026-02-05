import React, { useState } from 'react'
import { Box, Button, Dialog, DialogContent, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import GridViewIcon from '@mui/icons-material/GridView'
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useGetAllCategoriesQuery } from 'src/app/role/services/api'
import useCasherScreen from '../hooks/use-casher-screen'
import SimpleDialog from '@renderer/components/dialog'

// Custom Swiper styles for categories
const categorySwiperStyles = (theme: any) => ({
  '& .swiper-button-next, & .swiper-button-prev': {
    color: `${theme.palette.primary.main} !important`,
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
})

// Categories data array
const categoriesData = [
  {
    id: 1,
    name: 'All Categories',
    itemCount: 116,
    color: '#08468E', // Blue
    isDefault: true,
    icon: true
  },
  {
    id: 2,
    name: 'Category 2',
    itemCount: 100,
    color: '#D9D9D9', // Gray
    isDefault: false,
    icon: false
  },

  {
    id: 3,
    name: 'Category 3',
    itemCount: 100,
    color: '#E3C775 ', // Yellow/Gold
    isDefault: false,
    icon: false
  },
  {
    id: 3,
    name: 'Category 3',
    itemCount: 100,
    color: '#7875 ', // Yellow/Gold
    isDefault: false,
    icon: false
  },
  {
    id: 3,
    name: 'Category 3',
    itemCount: 100,
    color: '#E37775 ', // Yellow/Gold
    isDefault: false,
    icon: false
  },
  {
    id: 4,
    name: 'Category 4',
    itemCount: 100,
    color: '#84CAFF', // Light Blue
    isDefault: false,
    icon: false
  },
  {
    id: 3,
    name: 'Category 3',
    itemCount: 100,
    color: '#E3C775 ', // Yellow/Gold
    isDefault: false,
    icon: false
  },
  {
    id: 5,
    name: 'Category 5',
    itemCount: 100,
    color: ' #3D62A7', // Dark Blue
    isDefault: false,
    icon: false
  },
  {
    id: 5,
    name: 'Category 5',
    itemCount: 100,
    color: '#3f51b5', // Dark Blue
    isDefault: false,
    icon: false
  },
  {
    id: 5,
    name: 'Category 5',
    itemCount: 100,
    color: '#3f51b5', // Dark Blue
    isDefault: false,
    icon: false
  },
  {
    id: 5,
    name: 'Category 5',
    itemCount: 100,
    color: '#fff', // Dark Blue
    isDefault: false,
    icon: false
  }
]

// Styled components
const CategoryCard = styled(Box)<{ bgColor: string; isSelected?: boolean }>(
  ({ theme, bgColor, isSelected }) => ({
    backgroundColor: isSelected ? theme.palette.primary.dark : bgColor,
    borderRadius: '12px',
    padding: '20px',
    height: '75px',
    minWidth: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    // border: isSelected ? `3px solid ${theme.palette.primary.contrastText}` : 'none',
    // boxShadow: theme.shadows[isSelected ? 3 : 1],
    '&:hover': {
      transform: 'translateY(-2px)'
      // boxShadow: theme.shadows[4]
    }
  })
)

const ViewAllButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '4px 12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '12px',
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  backgroundColor: 'transparent',
  minWidth: 'unset',
  lineHeight: 1.2,
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
  const theme = useTheme()
  const { data, isFetching } = useGetAllCategoriesQuery()
  const { selectedCategory, setSelectedCategory } = useCasherScreen()
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false)

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory?.(categoryId.toString())
  }

  const handleViewAllClick = () => {
    setIsAllCategoriesOpen(true)
    if (onViewAll) {
      onViewAll()
    }
  }

  const handleCloseAllCategories = () => setIsAllCategoriesOpen(false)

  return (
    <Box sx={{ padding: '0', paddingBottom: '0px' }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: '10px' }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            fontSize: { xs: '14px', md: '18px' }
          }}
        >
          {t('Choose Category')}
        </Typography>

        <ViewAllButton variant="text" onClick={handleViewAllClick}>
          {t('View All')}
        </ViewAllButton>
      </Stack>

      <Box
        sx={(theme) => ({
          position: 'relative',
          paddingBottom: '15px',
          ...categorySwiperStyles(theme)
        })}
      >
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
              bgColor={!selectedCategory ? theme.palette.primary.dark : theme.palette.action.hover}
              isSelected={!selectedCategory}
              onClick={() => setSelectedCategory?.('')}
              sx={{
                justifyContent: 'space-between'
              }}
            >
              <GridViewIcon
                sx={(theme) => ({
                  color: theme.palette.primary.contrastText,
                  fontSize: 32,
                  marginBottom: '12px',
                  marginLeft: 'auto'
                })}
              />

              {/* Category Name */}
              <Box>
                <Typography
                  variant="h6"
                  sx={(theme) => ({
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '8px',
                    fontSize: { xs: '11px', md: '14px' }
                  })}
                >
                  {t('All Categories')}
                </Typography>

                {/* Item Count */}
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    color: theme.palette.primary.contrastText,
                    textAlign: 'center',
                    fontSize: '14px'
                  })}
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
                bgColor={theme.palette.action.hover}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
                sx={{
                  // justifyContent: category.icon ? "space-between" : "flex-end",
                  justifyContent: 'space-between'
                }}
              >
                {/* Category Name */}
                {/* <Box> */}
                <Typography
                  variant="h6"
                  sx={(theme) => ({
                    color:
                      selectedCategory === category.id
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '8px',
                    fontSize: { xs: '10px', md: '12px' }
                  })}
                >
                  {category.name === 'All Categories' ? t('All Categories') : category.name}
                </Typography>

                {/* Item Count */}
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    color:
                      selectedCategory === category.id
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.secondary,
                    textAlign: 'center',
                    fontSize: '14px'
                  })}
                >
                  {category.productsCount || 0} items
                </Typography>
                {/* </Box> */}
              </CategoryCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* View All Categories Popup */}
      <SimpleDialog
        open={isAllCategoriesOpen}
        setOpen={handleCloseAllCategories}
        fullWidth
        maxWidth="md"
        title={t('All Categories')}
      >
        <DialogContent sx={{ p: 2, minHeight: '300px' }}>
          {/* <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t('All Categories')}
            </Typography>
            <Button variant="outlined" onClick={handleCloseAllCategories}>
              {t('close')}
            </Button>
          </Stack> */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr 1fr',
                sm: '1fr 1fr',
                md: '1fr 1fr 1fr',
                lg: '1fr 1fr 1fr 1fr'
              },
              gap: 2
            }}
          >
            {data?.data.map((category) => (
              <Box key={category.id}>
                <CategoryCard
                  bgColor={theme.palette.action.hover}
                  isSelected={selectedCategory === category.id}
                  onClick={() => {
                    setSelectedCategory?.(category.id.toString())
                    handleCloseAllCategories()
                  }}
                  sx={{ height: 100, justifyContent: 'space-between' }}
                >
                  <Typography
                    variant="h6"
                    sx={(theme) => ({
                      color:
                        selectedCategory === category.id
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary,
                      fontWeight: 'bold',
                      fontSize: '12px'
                    })}
                  >
                    {category.name === 'All Categories' ? t('All Categories') : category.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={(theme) => ({
                      color:
                        selectedCategory === category.id
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.secondary
                    })}
                  >
                    {category.productsCount || 0} {t('Items')}
                  </Typography>
                </CategoryCard>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </SimpleDialog>
    </Box>
  )
}

export default CategorySection
