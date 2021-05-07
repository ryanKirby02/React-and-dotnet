import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { format } from 'date-fns';
import ActivityAttendeesItemList from './ActivityAttendeesItemList';
import { observer } from 'mobx-react-lite';

interface Props {
  activity: Activity;
}

const ActivityListItem = ({ activity }: Props) => {
  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label attached='top' color='red' content='This event is cancelled' style={{textAlign: 'center'}} />
        )}
        <Item.Group>
          <Item>
            <Item.Image style={{marginBottom: 3}} size='tiny' circular src={activity.host?.image || '/assets/user.png'} />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>Hosted by <Link style={{color: 'orange'}} to={`/profile/${activity.host?.username}`}>{activity.host?.displayName}</Link> </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color='orange'>
                    You Are Hosting This Event!
                  </Label>
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color='green'>
                    You Are Going to This Event!
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' color='teal' /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
          <Icon name='marker' color='teal' /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityAttendeesItemList attendees={activity.attendees!} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated='right' content='View' />
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityListItem);
