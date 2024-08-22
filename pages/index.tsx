import { GetServerSidePropsContext, NextPage } from 'next';
import serverSideWrapper from '../utils/serverSideWrapper';
import { getData } from '../utils/axiosClientWrapper';

import { loaderContext } from '../components/loader/loadContext';
import ErrorsWrapper from '../utils/ErrorsWrapper';
import { ErrorAlert } from '../components/errorAlert/errorAlert';
import { useContext, useEffect, useState } from 'react';

//serverside render, controls access to page
export const getServerSideProps = async (
    context: GetServerSidePropsContext | undefined
) => {
    let query = context?.query;
    return serverSideWrapper(context, getData, 'generation/1', query);
};

const PokemonDetails = ({
    pokemon,
}: {
    pokemon: { name: string; url: string };
}) => {
    const [pokemonImage, setPokemonImage] = useState<string | null>(null);

    const loadPokemonImage = async () => {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        const body = await response.json();

        setPokemonImage(body.sprites.front_default);
    };

    return (
        <li className="block mb-2">
            <a onClick={loadPokemonImage} className="block rounded hover:bg-yellow-100 cursor-pointer bg-gray-200 px-4 py-2">
                {pokemon.name}
                {pokemonImage && <img src={pokemonImage} alt={pokemon.name} />}
            </a>
        </li>
    );
};

const PokemonsList = ({
    pokemons,
}: {
    pokemons: Array<{ name: string; url: string }>;
}) => {
    console.log(pokemons);
    return (
        <ul className="mx-auto max-w-80">
            {pokemons.map((pokemon) => (
                <PokemonDetails key={pokemon.name} pokemon={pokemon} />
            ))}
        </ul>
    );
};

const Landing: NextPage<any> = (props: any) => {
    const { loading, setLoading } = useContext(loaderContext);
    const [isVisible, setIsVisible] = useState(true);

    const onClick = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        if (!setLoading) {
            return;
        }

        setLoading(false);
    }, []);

    console.log('props', props);

    if (!props.data) {
        return ErrorAlert(
            props?.error
                ? props.error
                : 'Data returned from server was undefined'
        );
    }

    return (
        <ErrorsWrapper error={props?.connectionError}>
            <div className="bg-white h-auto py-8 px-10 "></div>
            <button onClick={onClick}>Hello</button>

            {isVisible && <p>Text</p>}

            <PokemonsList pokemons={props?.data?.pokemon_species} />
        </ErrorsWrapper>
    );
};

export default Landing;
