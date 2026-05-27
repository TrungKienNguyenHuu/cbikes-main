import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./components/header/Header";
import { Filter } from "./components/filter/Filter";
import { BikesGrid } from "./components/bikesGrid/BikesGrid";
import { CategoryButtonsGroup } from "./components/categoryButtonsGroup/CategoryButtonsGroup";
import { PriceControl } from "./components/priceControl/PriceControl";
import { ShoppingCart } from "./components/shoppingCart/ShoppingCart";
import { ProductDetail } from "./components/header/ProductDetail";
import { useFilter } from "./hooks/filter.hook";
import { useShoppingCart } from "./hooks/shoppingCart.hook";
import { WEB_APP_NAME } from "./common/constants";

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

export const App = () => {
  const {
    filterState: { currentCategory, maxPrice },
    filteredBikesList,
    handleCurrentCategory,
    handleMaxPrice,
    isLoading,
    error,
  } = useFilter();
  const { shoppingCart, addBikeToCart, removeBikeFromCart } = useShoppingCart();

  return (
    <Router basename="/cbikes">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header title={WEB_APP_NAME} />
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
                    <BikesGrid
                      filteredBikesList={filteredBikesList}
                      addBikeToCart={addBikeToCart}
                    />
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
      </Routes>
    </Router>
  );
};
