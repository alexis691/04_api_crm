import React from 'react';
import {Formik, Form, Field} from 'formik';
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import Alerta from './Alerta';
import Spinner from './Spinner';

const Formulario = ({cliente, cargando}) => {
    
    const navigate = useNavigate();

    //Reglas de validacion
    const nuevoCLienteSchema = Yup.object().shape({
        nombre: Yup.string().min(3, 'El nombre es muy corto').max(40, 'El nombre es muy largo').required('El nombre de cliente es obligatorio'),
        empresa: Yup.string().required('El nombre de la empresa es obligatorio'),
        email: Yup.string().email('Email no valido').required('El email es obligatorio'),
        telefono: Yup.number().positive().integer().typeError('El numero no es valido')
    })

    //Envio de datos una vez esten validados
    const handleSubmit = async (valores) => {
        try{
            let respuesta
            if(cliente.id){
                //Editando
                const url = `http://localhost:4000/clientes/${cliente.id}`
                //esta es el let de afuera
                respuesta = await fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(valores),
                    headers: {
                        'Content-Type': 'application/json',  
                    }
                })

            }else{
                //Agregando
                const url = 'http://localhost:4000/clientes'
                //esta es el let de afuera
                respuesta = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(valores),
                    headers: {
                        'Content-Type': 'application/json',  
                    }
                })

            }
            
            await respuesta.json();
            navigate('/clientes')

        } catch (error) {
            console.log(error);
        }
    }


    return (
        cargando ? <Spinner/> : (
            <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto'>
                <h1 className='text-gray-600 font-bold text-xl uppercase text-center'>{cliente?.nombre? 'Editar Cliente' : 'Agregar Cliente'}</h1>

                <Formik
                    //valores iniciales
                    initialValues={{
                        nombre: cliente?.nombre ?? '',
                        empresa: cliente?.empresa ?? '',
                        email: cliente?.email ?? '',
                        telefono: cliente?.telefono ?? '',
                        notas: cliente?.notas ?? '',                
                    }}
                    enableReinitialize={true}
                    onSubmit={ async (values, {resetForm}) => {
                        await handleSubmit(values)

                        resetForm();
                    }}
                    //eschema de valdacion
                    validationSchema={nuevoCLienteSchema}
                >
                    {/* Eventos que se disparan al haber un error */}
                    {({errors, touched}) => {
                        return (
                            <Form 
                                className='mt-10'
                            >
                                <div className='mb-4'> 
                                    <label
                                        className='text-gray-800'
                                        htmlFor='nombre'
                                    >Nombre: </label>
                                    <Field 
                                        id="nombre"
                                        name='nombre'
                                        type="text"
                                        className="mt-2 block w-full p-3 bg-gray-50"
                                        placeholder="Nombre del Cliente"
                                    />
                                    {errors.nombre && touched.nombre? (
                                        <Alerta>{errors.nombre}</Alerta>
                                    ) : null}
                                </div>
                                <div className='mb-4'> 
                                    <label
                                        className='text-gray-800'
                                        htmlFor='empresa'
                                    >Empresa: </label>
                                    <Field 
                                        id="empresa"
                                        name='empresa'
                                        type="text"
                                        className="mt-2 block w-full p-3 bg-gray-50"
                                        placeholder="Empresa del Cliente"
                                    />
                                    {errors.empresa && touched.empresa? (
                                        <Alerta>{errors.empresa}</Alerta>
                                    ) : null}
                                </div>
                                <div className='mb-4'> 
                                    <label
                                        className='text-gray-800'
                                        htmlFor='email'
                                    >E-mail: </label>
                                    <Field 
                                        id="email"
                                        name='email'
                                        type="email"
                                        className="mt-2 block w-full p-3 bg-gray-50"
                                        placeholder="E-mail del Cliente"
                                    />
                                    {errors.email && touched.email? (
                                        <Alerta>{errors.email}</Alerta>
                                    ) : null}
                                </div>
                                <div className='mb-4'> 
                                    <label
                                        className='text-gray-800'
                                        htmlFor='telefono'
                                    >Telefono: </label>
                                    <Field 
                                        id="telefono"
                                        name='telefono'
                                        type="tel"
                                        className="mt-2 block w-full p-3 bg-gray-50"
                                        placeholder="Telefono del Cliente"
                                    />
                                    {errors.telefono && touched.telefono? (
                                        <Alerta>{errors.telefono}</Alerta>
                                    ) : null}
                                </div>
                                <div className='mb-4'> 
                                    <label
                                        className='text-gray-800'
                                        htmlFor='notas'
                                    >Notas: </label>
                                    <Field 
                                        as="textarea"
                                        id="notas"
                                        name='notas'
                                        type="text"
                                        className="mt-2 block w-full p-3 bg-gray-50 h-40"
                                        placeholder="Notas del Cliente"
                                    />
                                </div>
                                
                                <input
                                    type="submit"
                                    value={cliente?.nombre? 'Editar Cliente' : 'Agregar Cliente'}
                                    className='mt-5 w-full bg-blue-800 p-2 text-white uppercase font-bold text-lg'
                                />
                            </Form>
                        )
                    }}

                </Formik>
        
            </div>
        )
    );
};

//Datos por defecto al agregar cliente
Formulario.defaultProps = {
    cliente: {},
    cargando: false
}

export default Formulario;
