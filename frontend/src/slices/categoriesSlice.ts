import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import FitlyApi from '../Api/FitlyApi';

interface CategoryState {
    categories: {}[],
    selectedCategory: {}
};

const initialState: CategoryState = {
    categories: [],
    selectedCategory: {}
};

interface Category {
    id?: number,
    name: string,
    description: string
}

export const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(findAllCategories.fulfilled, (state, action: PayloadAction<[]>) => {
            state.categories = action.payload
        })
        .addCase(findACategory.fulfilled, (state, action: PayloadAction<{}>) => {
            state.selectedCategory = action.payload
        })
        .addCase(addCategory.fulfilled, (state, action: PayloadAction<{}>) => {
            state.categories.push(action.payload)
        })
        .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
            state.categories = [...(state.categories.filter( (category: Category) => category.id !== action.payload.id)), action.payload]

        })
        .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
            state.categories = state.categories.filter( (category: Category) => category.id !== action.payload)

        })
    }
});

export const findAllCategories = createAsyncThunk(
    "categories/findAllCategories",
    async () => {
        try{
            let categories : {}[] = await FitlyApi.findAllCategories();
            return categories;
        }
        catch (err){
            return err
        }
    }
)

export const findACategory = createAsyncThunk(
    "categories/findACategory",
    async (categoryId: string) => {
        try{
            let category : {} = await FitlyApi.findCategory({categoryId: categoryId})
            return category
        }
        catch (err){
            return err
        }
    }
)

export const addCategory = createAsyncThunk(
    "categories/categoryAdded",
    async (data: {}) => {
        try{
            let category: {} = await FitlyApi.createCategory(data);
            return category;
        }
        catch (err){
            return err
        }
    }
)

interface updateData { 
    categoryId: number,
    name: string,
    description: string
}
export const updateCategory = createAsyncThunk(
    "categories/categoryUpdated",
    async (data: updateData) => {
        try{
            let category : Category = await FitlyApi.updateCategory(data);
            return category;
        }
        catch (err){
            return err
        }
    }
)

export const deleteCategory = createAsyncThunk(
    "categories/categoryDeleted",
    async (categoryId : number) => {
        try{
            await FitlyApi.deleteCategory({categoryId});
            return categoryId
        }
        catch (err){
            return err
        }
    }
)

export const selectCategories = state => state.categories.categories;
export const selectcategory = state => state.categories.selectedCategory;

export default categoriesSlice.reducer;