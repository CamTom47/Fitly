import React, { useEffect, useState } from "react";
import FitlyApi from "../../Api/api";
import Category from "../Category/Category";

const CategoryList = () => {

    const [categories, setCategories] = useState(null);

    useEffect( () => {
        const getCategories = async() => {
            try{
                const categories = await FitlyApi.findAllEquipments();
                setCategories(categories);
            }
            catch(err){
                console.error('App loadCategories: probolem loading', err);
                setCategories(null);
            }
        }
        getCategories()
    }, [categories])

    const categoryComponents = categories.map(c => (
        <Category name={c.name}/>
    ))

    return (
        <>
        {categoryComponents}
        </>
    )
}

export default CategoryList