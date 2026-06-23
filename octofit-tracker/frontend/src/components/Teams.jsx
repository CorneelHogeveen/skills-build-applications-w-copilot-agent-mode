import CollectionView from './CollectionView';

export default function Teams() {
  return (
    <CollectionView
      title="Teams"
      endpointPath="/api/teams/"
      emptyLabel="Nog geen teams gevonden."
    />
  );
}
