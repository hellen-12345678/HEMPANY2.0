<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Iniciar sesión - Coffe Hempany</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

    <main>

        <section class="login">

            <div class="login-contenedor">

                <!-- INFORMACIÓN -->
                <div class="login-informacion">

                    <p class="seccion-subtitulo">
                        BIENVENIDO A COFFE HEMPANY
                    </p>

                    <h2>
                        Inicia sesión
                    </h2>

                    <p>
                        Ingresa a tu cuenta para disfrutar de todas
                        las opciones de COFFE HEMPANY.
                    </p>

                </div>


                <!-- FORMULARIO -->
                <div class="login-formulario">

                    <form action="#" method="post">

                        <!-- CORREO -->
                        <div class="campo">

                            <label for="correo">
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                placeholder="Ingresa tu correo"
                                required
                            >

                        </div>


                        <!-- CONTRASEÑA -->
                        <div class="campo">

                            <label for="contrasena">
                                Contraseña
                            </label>

                            <input
                                type="password"
                                id="contrasena"
                                name="contrasena"
                                placeholder="Ingresa tu contraseña"
                                required
                            >

                        </div>


                        <!-- OPCIONES -->
                        <div class="login-opciones">

                            <label>
                                <input type="checkbox">
                                Recordarme
                            </label>

                            <a href="#">
                                ¿Olvidaste tu contraseña?
                            </a>

                        </div>


                        <!-- BOTÓN -->
                        <button type="submit" onclick="window.location.href='index.html'">
                            Iniciar sesión
                        </button>


                        <!-- REGISTRO -->
                        <div class="registro">

                            <p>
                                ¿No tienes una cuenta?
                                <a href="registro.html">
                                    Regístrate
                                </a>
                            </p>

                        </div>

                    </form>

                </div>

            </div>

        </section>

    </main>

</body>

</html>
