import gymOnwerAuth from "./api/gymOwnerAuth";
import instance from "./config";
const api={
    gymOnwerAuth:gymOnwerAuth(instance)
}
export default api