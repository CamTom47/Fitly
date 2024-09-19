import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import FitlyApi from '../Api/FitlyApi'

const initialState = {
    categories: [],
    selectedCategory: {}
}

export const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducer: {},
    extraReducers: builder => {
        builder
        .addCase(findAllCategories.fulfilled, (state, action) => {
            state.categories = action.payload
        })
        .addCase(findACategory.fulfilled, (state, action) => {
            state.selectedCategory = action.payload
        })
        .addCase(addCategory.fulfilled, (state, action) => {
            state.categories.push(action.payload)
        })
        .addCase(updateCategory.fulfilled, (state, action) => {
            state = [...state, action.payload]
        })
        .addCase(deleteCategory.fulfilled, (state) => {
            return state
        })
    }
});

export const findAllCategories = createAsyncThunk(
    "categories/findAllCategories",
    async () => {
        try{
            let categories = await FitlyApi.findAllCategories();
            return categories;
        }
        catch (err){
            return err
        }
    }
)

export const findACategory = createAsyncThunk(
    "categories/findACategory",
    async (categoryId) => {
        try{
            let category = await FitlyApi.findCategory({category_id: categoryId})
            return category
        }
        catch (err){
            return err
        }
    }
)

export const addCategory = createAsyncThunk(
    "categories/categoryAdded",
    async (data) => {
        try{
            let category = await FitlyApi.addCategory(data);
            return category;
        }
        catch (err){
            return err
        }
    }
)

export const updateCategory = createAsyncThunk(
    "categories/categoryUpdated",
    async (categoryId, data) => {
        try{
            let category = await FitlyApi.updateCategory(categoryId, data);
            return category;
        }
        catch (err){
            return err
        }
    }
)

export const deleteCategory = createAsyncThunk(
    "categories/categoryDeleted",
    async (categoryId, data) => {
        try{
            await FitlyApi.updateCategory(categoryId, data);
        }
        catch (err){
            return err
        }
    }
)

export const selectCategories = state => state.categories.categories;
export const selectcategory = state => state.categories.selectedCategory;

export default categoriesSlice.reducer;