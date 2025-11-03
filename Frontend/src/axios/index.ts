import gymOnwerAuth from "./api/gymOwnerAuth";
import memberAuth from "./api/memberAuth";
import ownermembershipPlan from "./api/membershipPlan";
import instance from "./config";
const api={
    gymOnwerAuth:gymOnwerAuth(instance),
    memberAuth:memberAuth(instance),
    ownermembershipPlan:ownermembershipPlan(instance)
}
export default api