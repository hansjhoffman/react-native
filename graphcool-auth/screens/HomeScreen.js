import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { compose, graphql } from 'react-apollo';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-swipeable';
import { Constants } from 'expo';
import moment from 'moment';

import { CreateScreen, UpdateScreen } from '../screens';
import { ALL_LIFTS_QUERY, DELETE_LIFT_MUTATION } from '../api/graphcool';

const { width } = Dimensions.get('window');

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      createModalVisible: false,
      updateModalVisible: false,
      item: null,
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      submitLift: this._submitLift,
    });
  }

  _submitLift = () => {
    this.setState({ createModalVisible: true });
  };

  _updateLift(item) {
    this.setState({ updateModalVisible: true, item });
  }

  _deleteLift(id) {
    this.props
      .deleteLiftMutation({
        variables: { id },
      })
      .then(result => {
        this.props.allLiftsQuery.refetch();
      })
      .catch(e => {
        console.log(e);
      });
  }

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({ item }) => (
    <Swipeable
      leftButtons={[
        <TouchableOpacity style={styles.swipableEdit} onPress={() => this._updateLift(item)}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-clipboard-outline' : 'md-clipboard'} size={28} />
        </TouchableOpacity>,
      ]}
      rightButtons={[
        <TouchableOpacity style={styles.swipableDelete} onPress={() => this._deleteLift(item.id)}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-trash-outline' : 'md-trash'} size={28} />
        </TouchableOpacity>,
      ]}>
      <View style={styles.card}>
        <View style={styles.movementColumn}>
          <Text>{item.movement}</Text>
        </View>
        <View style={styles.weightColumn}>
          <Text>
            {item.weight} {item.units}
          </Text>
        </View>
        <View style={styles.dateColumn}>
          <Text>{moment(item.createdAt, moment.ISO_8601).format('MM/DD/YYYY')}</Text>
        </View>
      </View>
    </Swipeable>
  );

  render() {
    if (this.props.allLiftsQuery.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (this.props.allLiftsQuery.error) {
      console.log(this.props.allLiftsQuery.error);
      return <Text>Error!</Text>;
    }

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          visible={this.state.createModalVisible}
          onRequestClose={() => this.setState({ createModalVisible: false })}>
          <CreateScreen
            onComplete={() => {
              this.props.allLiftsQuery.refetch();
              this.setState({ createModalVisible: false });
            }}
          />
        </Modal>
        <Modal
          animationType="slide"
          visible={this.state.updateModalVisible}
          onRequestClose={() => this.setState({ updateModalVisible: false })}>
          <UpdateScreen
            onComplete={() => {
              this.props.allLiftsQuery.refetch();
              this.setState({ updateModalVisible: false });
            }}
            item={this.state.item}
          />
        </Modal>
        <FlatList
          data={this.props.allLiftsQuery.user.lifts}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListEmptyComponent={<Text>Hey Hans! You have 0 lifts in our database.</Text>}
        />
      </View>
    );
  }
}

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    title: 'Lifts',
    headerStyle: {
      ...Platform.select({
        android: {
          marginTop: Constants.statusBarHeight,
        },
      }),
    },
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.state.params.submitLift()}
        style={{ marginRight: 15 }}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle'}
          size={28}
        />
      </TouchableOpacity>
    ),
  };
};

export default compose(
  graphql(ALL_LIFTS_QUERY, { name: 'allLiftsQuery' }),
  graphql(DELETE_LIFT_MUTATION, { name: 'deleteLiftMutation' })
)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    height: 55,
    width,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipableEdit: {
    backgroundColor: '#D3D3D3',
    height: 55,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 28,
  },
  swipableDelete: {
    backgroundColor: '#FF6666',
    height: 55,
    justifyContent: 'center',
    paddingLeft: 28,
  },
  labelRow: {
    flexDirection: 'row',
    backgroundColor: '#D3D3D3',
    paddingHorizontal: 15,
  },
  movementColumn: {
    justifyContent: 'flex-start',
    width: width * 0.4,
  },
  weightColumn: {
    justifyContent: 'center',
    width: width * 0.3,
  },
  dateColumn: {
    justifyContent: 'flex-end',
    width: width * 0.3,
  },
});
