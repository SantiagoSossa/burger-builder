import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_,i) => {
                return <BurgerIngredient key={igKey + i} type={igKey} />;
            });
        })
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);
           
    if(transformedIngredients.length === 0){
        transformedIngredients = <p>Please start adding ingredients!</p>
    }
    return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;

//     let counter = 0;
//     let transformedIngredients = Object.keys(props.ingredients)
//         .map(igKey => {
//                 counter += props.ingredients[igKey];
//                 return <BurgerIngredient key={igKey} type={props.ingredients[igKey] > 0? igKey: ""} />;
//             });
//     if(counter === 0){
//         transformedIngredients = <p>Please start adding ingredients!</p>
//     } 