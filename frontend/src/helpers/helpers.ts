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

export const equipmentCheckForExerciseUpdate = async (equipmentNameCompare : string , userId : number) => {
    try{
        let allEquipment : Equipment[] = await FitlyApi.findAllEquipments();
        let match = allEquipment.find( equipment => equipment.name === equipmentNameCompare)
        if (match) return match.id
        else{
            let newEquipment : Equipment = await FitlyApi.createEquipment({
                "userId": userId,
                "name": equipmentNameCompare
            })
            return newEquipment.id
        }
        }
         catch (err){
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
