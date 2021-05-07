import { observer } from 'mobx-react-lite';
import { SyntheticEvent, useState } from 'react';
import { Button, Card, Grid, GridColumn, Header, Image, Tab } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/ImageUpload/PhotoUploadWidget';
import { Photo, Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
  profile: Profile;
}

const ProfilePhotos = ({ profile }: Props) => {
  const {
    profileStore: { isCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deletePhoto },
  } = useStore();
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState('');

  const photoUploadhandler = (file: Blob) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  const setMainPhotoHandler = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  };

  const deletePhotohandler = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  };

  return (
    <Tab.Pane>
      <Grid>
        <GridColumn width={16}>
          <Header icon='image' content='Photos' floated='left' />
          {isCurrentUser && (
            <Button
              floated='right'
              basic
              content={addPhotoMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </GridColumn>
        <GridColumn width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget uploadPhoto={photoUploadhandler} loading={uploading} />
          ) : (
            <Card.Group>
              {profile.photos?.map((photo) => (
                <Card style={{ width: '150px' }} key={photo.id}>
                  <Image style={{ width: '150px', height: '150px', marginBottom: '5px' }} src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group fluid widths={2}>
                      <Button
                        basic
                        color='green'
                        content='Main'
                        name={'main' + photo.id}
                        disabled={photo.isMain}
                        onClick={(e) => setMainPhotoHandler(photo, e)}
                        loading={target === 'main' + photo.id && loading}
                      />
                      <Button
                        disabled={photo.isMain}
                        basic
                        color='red'
                        icon='trash'
                        loading={target === photo.id && loading}
                        name={photo.id}
                        onClick={(e) => deletePhotohandler(photo, e)}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </GridColumn>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
