const { User } = require("../../../entities/associateModels");

const populateUser = async () => {
  // Datos de usuarios
  const userData = [
    {
      name: "Federico",
      surname: "Bergantinos",
      email: "fbergantinos@uade.edu.ar",
      photoUrl:
        "https://fotos.perfil.com/2024/02/15/trim/1140/641/yeti-de-bruta-cocina-1755883.jpg",
      accountDetails: [
        {
          beneficiaryName: "Federico Bergantinos",
          beneficiaryAddress: "Lima 123, Buenos Aires, Argentina",
          accountNumber: "000123456789",
          accountType: "Checking Account",
        },
      ],
    },
  ];

  try {
    for (const user of userData) {
      // Verifica si el usuario ya existe
      const userExist = await User.findOne({ where: { email: user.email } });
      if (!userExist) {
        // Crea el usuario y sus detalles de cuenta asociados en una transacción atómica
        const newUser = await User.create(user, {
          include: [
            {
              association: User.associations.accountDetails,
            },
          ],
        });
        console.log(`Usuario ${newUser.name} creado con detalles de cuenta.`);
      } else {
        console.log(`El usuario con el email ${user.email} ya existe.`);
      }
    }
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
  }
};

module.exports = populateUser;
