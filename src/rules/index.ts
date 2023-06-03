import { Plan } from "@character/types";

const rules = {
    maxInstructionLength: (plan: Plan) => {
        switch (plan) {
            case Plan.ADVANCED:
                return 5000;
            case Plan.PRO:
                return 2000;
            default:
                return 1000;
        }
    }
};

export default rules;
