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