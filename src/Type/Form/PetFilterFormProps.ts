import BadRequest from "../Error/BadRequest";

type PetFilterFormProps = {
    submitPetFilter: { (filters: object): void; },
    filters?: any,
    error?: BadRequest
};

export default PetFilterFormProps;
