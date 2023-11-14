import usersModel from "../models/users.model.js";

export default class UsersDao {
  //Método asyncrono para obtener un usuario
  getOne = async (uid) => {
    try {
      const result = await usersModel.find({ email: uid });
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //Metodo asyncrono que actualiza el usuario
  updateOne = async (userId, data) => {
    try {
      const respuesta = await usersModel.findByIdAndUpdate(userId, {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        home_address: data.home_address,
        zip_code: data.zip_code,
        state: data.state,
        city: data.city,
      });
      return respuesta;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //Metodo asyncrono que actualiza la contraseña
  updatePassword = async (user, newPassword) => {
    try {
      const respuesta = await usersModel.findByIdAndUpdate(user, {
        password: newPassword,
      });
      return respuesta;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //Método asyncrono para actualizar el carrito
  updateCart = async (id, cartId) => {
    try {
      const respuesta = await usersModel.findByIdAndUpdate(id, {
        $addToSet: { carts: cartId },
      });
      return respuesta;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Método asyncrono para cambiar el role del usuario
  updateRole = async (id, role) => {
    try {
      const respuesta = await usersModel.findByIdAndUpdate(id, { role: role });
      return respuesta;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Método asyncrono para agregar documentos al usuario
  addDocuments = async (id, documents) => {
    try {
      const user = await usersModel.findById(id);
      for (const key in documents) {
        for (const document of documents[key]) {
          user.documents.addToSet({
            name: document.fieldname,
            reference: document.path,
          });
        }
      }
      const respuesta = await user.save();
      return respuesta;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  updateProfileImage = async (id, image) => {
    try {
      const respuesta = await usersModel.findOneAndUpdate(
        { _id: id, "documents.name": "userProfileImage" },
        { "documents.$.reference": image.path }
      );
      return respuesta;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}
