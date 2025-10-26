import { Usuario, Rol } from "../models/index.js";
import jwt from "jsonwebtoken";

// Generar tokens
export const generateTokens = (usuario) => {
  const accessToken = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
    expiresIn: "60m",
  });
  const refreshToken = jwt.sign(
    { id: usuario.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    

    const { nombre, email, password, telefono, direccion } = req.body;

    // 1. Buscar si el usuario ya existe por email
    let usuario = await Usuario.findOne({ where: { email } });

    if (usuario) {
      if (!usuario.password) {
        // Lógica para convertir a un usuario de red social a local
        
        usuario.password = password;
        usuario.proveedor = "local";
        if (nombre && !usuario.nombre) usuario.nombre = nombre;
        if (telefono && !usuario.telefono) usuario.telefono = telefono;
        if (direccion && !usuario.direccion) usuario.direccion = direccion;
        await usuario.save();

        const tokens = generateTokens(usuario);
        return res.status(200).json({
          success: true,
          message: "Usuario convertido a local exitosamente",
          data: {
            usuario,
            ...tokens,
          },
        });
      } else {
        // Si el usuario ya existe con contraseña, no se puede registrar
        
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado con una contraseña",
        });
      }
    }

    // 2. Si el email no existe, crear un nuevo usuario
    
    usuario = await Usuario.create({
      nombre,
      email,
      password,
      proveedor: "local",
      telefono,
      direccion,
    });

    // 3. Buscar el rol "comprador"
    
    const rolComprador = await Rol.findOne({ where: { nombre: "comprador" } });

    if (rolComprador) {
      // 4. Asignar el rol al nuevo usuario usando el método de Sequelize
      
      await usuario.setRoles([rolComprador.id]);
      
    } else {
      console.warn("⚠️ Advertencia: No se encontró el rol 'comprador' en la base de datos.");
    }

    // 5. Generar tokens y enviar respuesta
    const tokens = generateTokens(usuario);
    res.status(201).json({
      success: true,
      message: "Usuario registrado y rol asignado exitosamente",
      data: {
        usuario,
        ...tokens,
      },
    });

  } catch (err) {
  

  // Si el error viene de Sequelize (por ejemplo, violación de restricción única)
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: "El email ya está registrado en el sistema",
    });
  }

  // Si el error tiene mensaje personalizado (por seguridad, solo mostramos lo seguro)
  if (err.message) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Si no sabemos el tipo de error, mensaje genérico
  res.status(500).json({
    success: false,
    message: "Error interno al registrar usuario",
  });
}

};

// Login local
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({
      where: { email },
      include: [{ model: Rol, as: "roles", through: { attributes: [] } }],
    });

    if (!usuario) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }

    const isValid = await usuario.validarPassword(password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }

    // Nueva validación de estado y activo
    if (!usuario.activo) {
      return res
        .status(403)
        .json({ success: false, message: "Tu cuenta está desactivada ❌" });
    }

    if (usuario.estado !== "activo") {
      return res.status(403).json({
        success: false,
        message:
          usuario.estado === "pendiente"
            ? "Tu cuenta aún no fue aprobada 🔒"
            : "Tu cuenta está suspendida 🚫",
      });
    }

    // Actualizamos el proveedor solo si es distinto
    if (usuario.proveedor !== "local") {
      usuario.proveedor = "local";
      await usuario.save();
    }

    const tokens = generateTokens(usuario);

    const usuarioData = {
      ...usuario.toJSON(),
      isAdmin: usuario.es_admin,
      roles: usuario.roles.map((r) => r.nombre),
    };

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        usuario: usuarioData,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error en login" });
  }
};
