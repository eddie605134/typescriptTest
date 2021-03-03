declare namespace responseResult {

  interface MovieItems {
    title: string;
    comeDay: string;
    boxOffice: number;
  }
  
  interface DataStructure {
    [key: string]: MovieItems[];
  }

  type isLogin = boolean;
  type login = boolean; 
  type logout = boolean; 
  type getData = boolean; 
  type showData = DataStructure | boolean; 
}