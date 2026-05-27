import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./components/header/Header";
import { Filter } from "./components/filter/Filter";
import { BikesGrid } from "./components/bikesGrid/BikesGrid";
import { CategoryButtonsGroup } from "./components/categoryButtonsGroup/CategoryButtonsGroup";
import { PriceControl } from "./components/priceControl/PriceControl";
import { ShoppingCart } from "./components/shoppingCart/ShoppingCart";
import { ProductDetail } from "./components/header/ProductDetail";
import { PriceComparison } from "./components/priceComparison/PriceComparison";
import { useFilter } from "./hooks/filter.hook";
import { useShoppingCart } from "./hooks/shoppingCart.hook";
import { WEB_APP_NAME, COLORS, SPACING, BREAKPOINTS } from "./common/constants";
import { ToastProvider } from "./context/ToastContext";
import { ToastDisplay } from "./components/toast/ToastDisplay";
import { HeroSection } from "./components/hero/HeroSection";
import { Toolbar } from "./components/toolbar/Toolbar";
import { Pagination } from "./components/pagination/Pagination";

const AppContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
    filterState: { currentCategory, maxPrice },
    filteredBikesList,
    paginatedBikes,
    handleCurrentCategory,
    handleMaxPrice,
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
  } = useFilter();
  const { shoppingCart, addBikeToCart, removeBikeFromCart } = useShoppingCart();

  return (
    <>
      <ToastDisplay />
      <Router basename="/cbikes">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header title={WEB_APP_NAME} cartCount={shoppingCart.length} />
                <HeroSection />
                <AppContainer>
                  <Filter>
                    <CategoryButtonsGroup
                      currentCategory={currentCategory}
                      handleCurrentCategory={handleCurrentCategory}
                    />
                    <PriceControl maxPrice={maxPrice} handleMaxPrice={handleMaxPrice} />
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
                            <ResetButton onClick={resetFilters}>Reset Filters</ResetButton>
                          </EmptyState>
                        ) : (
                          <>
                            <BikesGrid
                              filteredBikesList={paginatedBikes}
                              addBikeToCart={addBikeToCart}
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
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route
            path="/comparison"
            element={<PriceComparison shoppingCart={shoppingCart} onBack={() => {}} />}
          />
        </Routes>
      </Router>
    </>
  );
};
