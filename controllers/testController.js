export const testController = (req, resp) => {
    resp.status(200).send({
        message:'Kavindu Structure server code',
        success:true
    })
}