import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./components/header/Header";
import { Filter, FilterSection, FilterSectionTitle } from "./components/filter/Filter";
import { BikesGrid } from "./components/bikesGrid/BikesGrid";
import { CategoryButtonsGroup } from "./components/categoryButtonsGroup/CategoryButtonsGroup";
import { BrandFilterDropdown } from "./components/filter/BrandFilterDropdown";
import { PriceControl } from "./components/priceControl/PriceControl";
import { ShoppingCart } from "./components/shoppingCart/ShoppingCart";
import { ProductDetail } from "./components/header/ProductDetail";
import { ProductDetailCopy } from "./components/header/ProductDetail_copy";
import { PriceComparison } from "./components/priceComparison/PriceComparison";
import { HotProducts } from "./components/hotProducts/HotProducts";
import { useFilter } from "./hooks/filter.hook";
import { useShoppingCart } from "./hooks/shoppingCart.hook";
import { useFavorites } from "./hooks/favorites.hook";
import { WEB_APP_NAME, COLORS, SPACING, BREAKPOINTS, BIKE_NEEDS_OPTIONS, BIKE_TIER_OPTIONS } from "./common/constants";
import { ToastProvider } from "./context/ToastContext";
import { ToastDisplay } from "./components/toast/ToastDisplay";
import { HeroSection } from "./components/hero/HeroSection";
import { Toolbar } from "./components/toolbar/Toolbar";
import { Pagination } from "./components/pagination/Pagination";
import { Footer } from "./components/footer/Footer";

const AppContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  width: 100%;
  max-width: min(100%, 1800px);
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const HotProductsContainer = styled.div`
  width: 100%;
  max-width: min(100%, 1800px);
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PageLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

interface PageContentProps {
  hasCart?: boolean;
}

const PageContent = styled.div<PageContentProps>`
  flex: 1;
  padding-bottom: ${props => props.hasCart ? '280px' : '0'};
  transition: padding-bottom 0.3s ease;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding-bottom: ${props => props.hasCart ? '320px' : '0'};
  }

  @media (max-width: 480px) {
    padding-bottom: ${props => props.hasCart ? '360px' : '0'};
  }
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 1.1rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 1.1rem;
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 4px;
  border: 1px solid #ef5350;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-size: 1.2rem;
  color: ${COLORS.textLight};
  margin-bottom: 2rem;
`;

const ResetButton = styled.button`
  padding: ${SPACING.sm} ${SPACING.lg};
  background-color: ${COLORS.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff5a1a;
  }
`;

export const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

const AppContent = () => {
  const {
    filterState: { currentCategory, minPrice, maxPrice, pricePreset, currentSeller, currentNeed, currentTier },
    filteredBikesList,
    paginatedBikes,
    handleCurrentCategory,
    handlePricePreset,
    handleMinPrice,
    handleMaxPrice,
    handleCurrentSeller,
    handleCurrentNeed,
    handleCurrentTier,
    isLoading,
    error,
    searchTerm,
    handleSearch,
    sortType,
    handleSort,
    itemsPerPage,
    handleItemsPerPage,
    currentPage,
    setCurrentPage,
    totalPages,
    resetFilters,
    dynamicCategories,
    dynamicSellers,
  } = useFilter();
  const { shoppingCart, addBikeToCart, removeBikeFromCart } = useShoppingCart();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  return (
    <>
      <ToastDisplay />
      <Router basename="/">
        <PageLayout>
          <PageContent hasCart={shoppingCart.length > 0}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Header
                      title={WEB_APP_NAME}
                      favorites={favorites}
                      searchTerm={searchTerm}
                      onSearch={handleSearch}
                    />
                    <HeroSection />
                    <HotProductsContainer>
                      <HotProducts days={7} limit={12} />
                    </HotProductsContainer>
                    <AppContainer>
                      <Filter>
                        <FilterSection>
                          <FilterSectionTitle>Brand</FilterSectionTitle>
                          <BrandFilterDropdown
                            items={dynamicCategories}
                            currentValue={currentCategory}
                            onChange={handleCurrentCategory}
                            placeholder="Select a brand"
                          />
                        </FilterSection>
                        <FilterSection>
                          <FilterSectionTitle>Store</FilterSectionTitle>
                          <CategoryButtonsGroup
                              categories={dynamicSellers}
                              currentCategory={currentSeller}
                              handleCurrentCategory={handleCurrentSeller}
                              compact
                          />
                        </FilterSection>
                        <FilterSection>
                          <FilterSectionTitle>Need</FilterSectionTitle>
                          <CategoryButtonsGroup
                              categories={BIKE_NEEDS_OPTIONS}
                              currentCategory={currentNeed || "all"}
                              handleCurrentCategory={handleCurrentNeed}
                              compact
                          />
                        </FilterSection>
                        <FilterSection>
                          <FilterSectionTitle>Tier</FilterSectionTitle>
                          <CategoryButtonsGroup
                              categories={BIKE_TIER_OPTIONS}
                              currentCategory={currentTier || "all"}
                              handleCurrentCategory={handleCurrentTier}
                              compact
                          />
                        </FilterSection>
                        <PriceControl
                          minPrice={minPrice}
                          maxPrice={maxPrice}
                          pricePreset={pricePreset}
                          onPresetChange={handlePricePreset}
                          onMinPriceChange={handleMinPrice}
                          onMaxPriceChange={handleMaxPrice}
                        />
                        <div>
                          <ResetButton type="button" onClick={resetFilters}>↻ Reset Filters</ResetButton>
                        </div>
                      </Filter>
                      <MainContent>
                        {isLoading ? (
                          <LoadingMessage>Loading bikes...</LoadingMessage>
                        ) : error ? (
                          <ErrorMessage>Error loading bikes: {error}</ErrorMessage>
                        ) : (
                          <>
                            <Toolbar
                              sortType={sortType}
                              onSortChange={handleSort}
                              itemsPerPage={itemsPerPage}
                              onItemsPerPageChange={handleItemsPerPage}
                              totalResults={filteredBikesList.length}
                              displayedResults={paginatedBikes.length}
                            />
                            {filteredBikesList.length === 0 ? (
                              <EmptyState>
                                <EmptyStateIcon>🚲</EmptyStateIcon>
                                <EmptyStateText>No bikes found matching your filters</EmptyStateText>
                                <ResetButton type="button" onClick={resetFilters}>Reset Filters</ResetButton>
                              </EmptyState>
                            ) : (
                              <>
                                <BikesGrid
                                  filteredBikesList={paginatedBikes}
                                  addBikeToCart={addBikeToCart}
                                  isFavorite={isFavorite}
                                  onToggleFavorite={toggleFavorite}
                                />
                                <Pagination
                                  currentPage={currentPage}
                                  totalPages={totalPages}
                                  onPageChange={setCurrentPage}
                                />
                              </>
                            )}
                          </>
                        )}
                      </MainContent>
                    </AppContainer>
                    <ShoppingCart
                      shoppingCart={shoppingCart}
                      removeBikeFromCart={removeBikeFromCart}
                    />
                  </>
                }
              />
              <Route
                path="/product/:productId"
                element={
                  <>
                    <Header
                      title={WEB_APP_NAME}
                      favorites={favorites}
                      searchTerm={searchTerm}
                      onSearch={handleSearch}
                    />
                    <ProductDetail addBikeToCart={addBikeToCart} />
                  </>
                }
              />
              <Route
                path="/test/product/:productId"
                element={
                  <>
                    <Header
                      title={WEB_APP_NAME}
                      favorites={favorites}
                      searchTerm={searchTerm}
                      onSearch={handleSearch}
                    />
                    <ProductDetailCopy />
                  </>
                }
              />
              <Route
                path="/comparison"
                element={
                  <>
                    <Header
                      title={WEB_APP_NAME}
                      favorites={favorites}
                      searchTerm={searchTerm}
                      onSearch={handleSearch}
                    />
                    <PriceComparison shoppingCart={shoppingCart} onBack={() => {}} />
                  </>
                }
              />
            </Routes>
          </PageContent>
          <Footer />
        </PageLayout>
      </Router>
    </>
  );
};
