const { User } = require("../../../entities/associateModels");

const populateUser = async () => {
  const users = [
    {
      name: "Fedeasdrico",
      surname: "Bergantinos",
      email: "email1@uade.edu.ar",
      photoUrl:
        "https://fotos.perfil.com/2024/02/15/trim/1140/641/yeti-de-bruta-cocina-1755883.jpg",
    },
    {
      name: "Axel",
      surname: "Santoro",
      email: "email2@uade.edu.ar",
      photoUrl:
        "https://fotos.perfil.com/2024/02/15/trim/1140/641/yeti-de-bruta-cocina-1755883.jpg",
    },
    {
      name: "Nicolas",
      surname: "Garcia",
      email: "email3@uade.edu.ar",
      photoUrl:
        "https://fotos.perfil.com/2024/02/15/trim/1140/641/yeti-de-bruta-cocina-1755883.jpg",
    },
    {
      name: "Matias",
      surname: "Caliz",
      email: "email4@uade.edu.ar",
      photoUrl:
        "https://fotos.perfil.com/2024/02/15/trim/1140/641/yeti-de-bruta-cocina-1755883.jpg",
    },
  ];

  try {
    const userExist = await User.count();
    if (userExist === 0) {
      await User.bulkCreate(users);
      console.log("User table has been populated with initial data.");
    } else {
      console.log("User table is already populated.");
    }
  } catch (error) {
    console.error("Error populating User table:", error);
  }
};

module.exports = populateUser;
