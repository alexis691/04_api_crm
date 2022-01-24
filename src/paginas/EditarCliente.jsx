import { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom'
import Formulario from '../components/Formulario';

const EditarCliente = () => {

    const {id} = useParams();
    const [cliente, setCliente] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const getClienteApi = async () => {

            try{
                const url = `${import.meta.env.VITE_API_URL}/${id}`
                const respuesta = await fetch(url)
                const resultado = await respuesta.json()
                
                setCliente(resultado)

            }catch(error){
                console.log(error);
            }

            //Valor contrario
            setCargando(!cargando)

        }

        getClienteApi();
    }, []);    

    return (
        <>
            <h1 className='font-black text-4xl text-blue-900'>Editar Cliente</h1>
            <p>Utiliza este formulario para editar datos de un cliente</p>

            {cliente?.nombre ? (
                <Formulario
                    cliente={cliente}
                    cargando={cargando}
                />
            ) : (<p>ID de cliente no valido</p>) }          
        </>
    )
};

export default EditarCliente;
