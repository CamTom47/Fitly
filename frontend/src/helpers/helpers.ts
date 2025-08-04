import FitlyApi from "../Api/FitlyApi";

/**
 * Helper function equipmentCheckForExerciseUpdate
 * @param {*} allEquipment all equipment in fitly database
 * @param {*} equipmentNameCompare equipment name being checked against
 * @param {*} currentUser currently logged in user
 * @returns equipmentId
 */

interface Equipment {
	id?: number;
	name: string;
	user_id: number;
	systemDefault: boolean;
}

//Checks to see if the use already has equipment with the same name to prevent duplication
export const equipmentCheckForExerciseUpdate = async (equipmentNameCompare: string, userId: number) => {
	try {
		let allEquipment: Equipment[] = await FitlyApi.findAllEquipments();

		//compare the equipmentNameCompare parameter against case-insensitive, space-insensitive match
		let match = allEquipment.find(
			(equipment) =>
				equipment.name.toLowerCase().split(" ").join("") === equipmentNameCompare.toLowerCase().split(" ").join("")
		);
		if (match) return true;
		else return false;
	} catch (err) {
		return err;
	}
};

export const equipmentMatch = async (equipmentId: number) => {
	try {
		let equipment: Equipment = await FitlyApi.findEquipment({ equipmentId });
		return equipment;
	} catch (err) {
		return err;
	}
};
