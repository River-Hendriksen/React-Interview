import { GetServerSidePropsContext, NextPage } from 'next';
import serverSideWrapper from '../utils/serverSideWrapper';
import { getData } from '../utils/axiosClientWrapper';

import { loaderContext } from '../components/loader/loadContext';
import ErrorsWrapper from '../utils/ErrorsWrapper';
import { ErrorAlert } from '../components/errorAlert/errorAlert';

//serverside render, controls access to page
export const getServerSideProps = async (
    context: GetServerSidePropsContext | undefined
) => {
    let query = context?.query;
    return serverSideWrapper(context, getData, 'generation/1', query);
};

const Landing: NextPage<any> = (props: any) => {
    // const { loading, setLoading } = useContext(loaderContext);

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
        </ErrorsWrapper>
    );
};

export default Landing;
