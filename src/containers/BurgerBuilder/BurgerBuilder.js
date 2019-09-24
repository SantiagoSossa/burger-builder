import React, {Component} from  'react';
import Aux from '../../hoc/Auxiliar/Auxiliar';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const ingredientPrices = {
    salad: 0.5,
    cheese: 1,
    bacon: 1,
    meat: 3
}

class BurgerBuilder extends Component {
    
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-burger-b5fdc.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true});
            });
    }

    updatePurchaseState(ingredients){
        //gets the sum of all the ingredients and if it's more than one then you can purchase it
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum,el) => {
            return sum + el;
        },0);
        this.setState({purchaseable: sum > 0});
    }

    purchaseHandler = () => {
        //opens up the modal of the order when the ORDER NOW button it's clicked
        this.setState({purchasing: true});
    }

    addIngredientHandler = (type) => {
        //add +1 to the specific ingredient in the ingredients list
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        //gets the price of the ingredient and adds it to the total price
        const priceAddition = ingredientPrices[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        //updates the state of totalPrice and the ingredients list
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});

        //calls this method to see if you can purchase the burger now
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
         //remove 1 to the specific ingredient in the ingredients list
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

         //gets the price of the ingredient and adds it to the total price
        const priceDeduction = ingredientPrices[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        //updates the state of totalPrice and the ingredients list
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});

        //calls this method to see if you can purchase the burger now
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseCancelHandler = () => {
        //closes the modal of the order when the cancel button button it's clicked
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {

        const queryParams =[];
        for (let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i)+ '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price='+this.state.totalPrice)
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?'+ queryString
        });
    }
    
    render() {

        //creates an boolean array with the state of each ingredient
        //if an ingredient has 0 quantity then his value would be false
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        //manage loader spinner
        let orderSummary = null;

        //load ingredients from database
        let burger = this.state.error?<p>Ingredients can't be loaded!</p>:<Spinner/>;

        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchaseable={this.state.purchaseable}
                    price={this.state.totalPrice}
                    order={this.purchaseHandler}/>
                </Aux>);
                orderSummary = 
                    <OrderSummary 
                    price={this.state.totalPrice}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    ingredients={this.state.ingredients}/>;
        }
        if(this.state.loading){
            orderSummary = <Spinner/>;
        }

        return(
            <Aux>
                <Modal 
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
