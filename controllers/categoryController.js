import categoryModel from '../models/categoryModel.js'
import { productModel } from '../models/productModel.js'

//create category
export const createCategoryController = async (req, resp) => {
    try {
        const {category} = req.body
        if(!category){
            return resp.status(404).send({
                success : false,
                message : 'Category Not Found'
            })
        }
        await categoryModel.create({category})
        resp.status(200).send({
            success : true,
            message : `${category} Category created successfully`,
        })
    } catch (error) {
        resp.status(500).send({
            success : false,
            message : 'Create Category API Error'
        })
    }
}


//get all category
export const getAllCategoryController = async (req, resp) => {
    try {
        const categories = await categoryModel.find({})
        if(!categories){
            return resp.status(404).send({
                success : false,
                message : 'No catogory found'
            })
        }
        resp.status(200).send({
            success : true,
            message : 'All categories fetched successfully',
            totalCategories : categories.length,
            categories
        })
    } catch (error) {
        resp.status(500).send({
            success : false,
            message : 'getAll Category API Error',
            error
        })
    }
}


//delete Category
export const deleteCategoryController = async(req, resp) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        if(!category){
            return resp.status(404).send({
                success : false,
                message : 'Category Not found'
            })
        }
        //find products with this category id
        const products = await productModel.find({category:category._id})
        //update product category
        for (let i=0; i<products.length; i++){
            const product = products[i]
            product.category = undefined
            await product.save()
        }
        await category.deleteOne()
        resp.status(200).send({
            success : true,
            message : 'Category deleted successfully'
        })
    } catch (error) {
        if(error.name === 'CastError'){
            return resp.status(500).send({
                success : false,
                message : 'Invalid ID'
            })
        }
        resp.status(500).send({
            success : false,
            message : 'delete Category API Error',
            error
        })
    }
}


//update category
export const updateCategoryController = async (req, resp) => {
    try {
        const {updatedCategory} = req.body
        const category = await categoryModel.findById(req.params.id)
        //validation
        if(!category){
            return resp.status(404).send({
                success : false,
                message : 'Category Not found'
            })
        }
        //find products with this category id
        const products = await productModel.find({category:category._id})
        //update product category
        for(let i=0; i<products.length; i++){
            const product = products[i]
            product.category = updatedCategory
            await product.save()
        }
        // Update the category's name
        if(updatedCategory) category.category = updatedCategory
        //save
        await category.save()
        resp.status(200).send({
            success : true,
            message : 'Category Updated successfully'
        })
    } catch (error) {
        if(error.name === 'CastError'){
            return resp.status(500).send({
                success : false,
                message : 'Invalid ID'
            })
        }
        resp.status(500).send({
            success : false,
            message : 'Update Category API Error',
            error
        })
    }
}