import http from "../../api/http-common";

export interface UserAccountDTO {
  accountId: number;
  accountName: string;
  avatarPath: string;
  role: string;
}


const UserAccountService = {
  searchUsers: async (query: string): Promise<UserAccountDTO[]> => {
    const response = await http.get<UserAccountDTO[]>(`/user/search?query=${query}`);
    return response.data;
  }
};

export default UserAccountService;