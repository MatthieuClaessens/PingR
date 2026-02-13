import http from "../api/http-common";
import type { UserAccount } from "../entities/userAccount";



const UserAccountService = {
  searchUsers: async (query: string): Promise<UserAccount[]> => {
    const response = await http.get<UserAccount[]>(`/user/search?query=${query}`);
    return response.data;
  }
};

export default UserAccountService;