import CollectionView from './CollectionView';

export default function Leaderboard() {
  const endpointUrl = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : '/api/leaderboard/';

  return (
    <CollectionView
      title="Leaderboard"
      endpointUrl={endpointUrl}
      emptyLabel="Nog geen leaderboard-data gevonden."
    />
  );
}
