import FitlyApi from "../Api/FitlyApi";


/**
 * Helper function equipmentCheckForExerciseUpdate
 * @param {*} allEquipment all equipment in fitly database
 * @param {*} equipmentNameCompare equipment name being checked against
 * @param {*} currentUser currently logged in user
 * @returns equipmentId
 */

interface Equipment {
    id?: number,
    name: string,
    user_id: number,
    systemDefault: boolean
};

export const equipmentCheckForExerciseUpdate = async (equipmentNameCompare : string , user_id : number) => {
    try{

        let allEquipment : Equipment[] = await FitlyApi.findAllEquipments();
        for( let equipment of allEquipment){
            if(equipment.name === equipmentNameCompare){
                return equipment.id
            } else{
                let newEquipment : Equipment = await FitlyApi.createEquipment({
                    "user_id": user_id,
                    "name": equipmentNameCompare
                })
                return newEquipment.id
            }}
        } catch (err){
            return err
        }
             
        
}

export const equipmentMatch = async (equipmentId : number) => {
    try{
        let equipment : Equipment = await FitlyApi.findEquipment({equipmentId});
        return equipment
    } catch(err){
        return err
    }
   
}
