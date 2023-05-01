import React from 'react';
import FormAlert from '@/components/FormAlert';
import { Container } from 'react-bootstrap';
import { useFavorites } from '@/util/db';
import PageLoader from '@/components/PageLoader';
import Links from '@/components/Links';
import { orbitron } from '@/util/util';

const Favorites = () => {
  const { isLoading, isError, data, error } = useFavorites();
  const buildLinks = (data) => {
    return data.map((data) => data.link);
  };

  const favsData = data && data.length > 0 ? buildLinks(data) : [];

  console.log('DATA', favsData);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Container>
      <h1
        className={`${orbitron.className}`}
        style={{ color: 'var(--primary-green' }}
      >
        Your Favorites
      </h1>
      {favsData.length > 0 ? (
        <Links links={favsData} favorites={favsData} showEditLink={false} />
      ) : (
        <FormAlert type="error" message="No favorites were found." />
      )}
    </Container>
  );
};

export default Favorites;
