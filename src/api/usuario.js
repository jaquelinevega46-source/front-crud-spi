import axios from "@/plugins/axios.js";

export const loginUsuario = async (correo, contrasenia) => {
  try {
    const response = await axios.post("/login", {
      email: correo,
      password: contrasenia,
    });

    return { ok: true, data: response.data };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.error || "Error al iniciar sesión",
      status: error.response?.status || 500,
    };
  }
};

export const obtenerUsuarios = async () => {
  try {
    const response = await axios.get("/users");

    return { ok: true, data: response.data };
  } catch (error) {
    return {
      ok: false,
      data: [],
      message: error.response?.data?.error || "Error al obtener usuarios",
      status: error.response?.status || 500,
    };
  }
};

export const crearUsuario = async ({ nombre, correo, contrasenia, rol, acceptTerms }) => {
  try {
    const response = await axios.post("/users", {
      name: nombre,
      email: correo,
      password: contrasenia,
      role: rol,
      ...(acceptTerms !== undefined ? { acceptTerms } : {}),
    });

    return { ok: true, data: response.data };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.error || "Error al crear usuario",
      status: error.response?.status || 500,
    };
  }
};

export const actualizarUsuario = async (id, { nombre, correo, contrasenia }) => {
  try {
    const response = await axios.put(`/users/${id}`, {
      name: nombre,
      email: correo,
      ...(contrasenia ? { password: contrasenia } : {}),
    });

    return { ok: true, data: response.data };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.error || "Error al actualizar usuario",
      status: error.response?.status || 500,
    };
  }
};

export const eliminarUsuario = async (id) => {
  try {
    const response = await axios.delete(`/users/${id}`);

    return { ok: true, data: response.data };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.error || "Error al eliminar usuario",
      status: error.response?.status || 500,
    };
  }
};
