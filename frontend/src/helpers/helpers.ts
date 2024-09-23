import FitlyApi from "../Api/FitlyApi";


/**
 * Helper function equipmentCheckForExerciseUpdate
 * @param {*} allEquipment all equipment in fitly database
 * @param {*} equipmentCompare equipment name being checked against
 * @param {*} currentUser currently logged in user
 * @returns equipmentId
 */

export const equipmentCheckForExerciseUpdate = async (equipmentCompare, user_id) => {
    let allEquipment = await FitlyApi.findAllEquipments();
    for( let equipment of allEquipment){
        if(equipment.name === equipmentCompare){
            return equipment.id
        } else{
            let newEquipment = await FitlyApi.createEquipment({
                "user_id": user_id,
                "name": equipmentCompare
            })
            return newEquipment.id
        }}
        
        
}

export const equipmentMatch = async (equipmentId) => {
        let equipment = await FitlyApi.findEquipment(equipmentId);
        return equipment
   
}
