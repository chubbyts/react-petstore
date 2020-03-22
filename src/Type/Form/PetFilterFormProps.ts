import BadRequest from "../Error/BadRequest";

type PetFilterFormProps = {
    submitPetFilter: { (filters: any): any; },
    filters?: any,
    error?: BadRequest
};

export default PetFilterFormProps;
