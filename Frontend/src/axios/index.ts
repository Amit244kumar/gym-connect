import gymOnwerAuth from "./api/gymOwnerAuth";
import memberAuth from "./api/memberAuth";
import instance from "./config";
const api={
    gymOnwerAuth:gymOnwerAuth(instance),
    memberAuth:memberAuth(instance)
}
export default api