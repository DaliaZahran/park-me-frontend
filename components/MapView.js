import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import { ScrollView } from "react-native-gesture-handler";
import MapView, { Marker, Callout } from "react-native-maps";
import Modal from "react-native-modal";
import Dropdown from "react-native-modal-dropdown";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Button } from "../components";
import { markerTheme, theme } from "../constants";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import DateTimePicker from "react-native-modal-datetime-picker";
import DatePicker from "react-native-datepicker";

const { height, width } = Dimensions.get("screen");
const API = "http://192.168.1.17:8080/api/parking";
const USERS_API = "http://192.168.1.17:8080/api/users";
class MyMapView extends React.Component {
  state = {
    active: null,
    activeModal: null,
    activeLots: [],
    hours: {},
    lotsTableData: [],
    tableHead: ["Lot No.", "Status"],
    widthArr: [150, 150],
    modalVisibility: false,
    futureModalVisibility: false,
    date: "",
    time: "",
    predictedFreeSlots: "",
    freeSpots: 0,
    predictionResult: 0,
  };

  UNSAFE_componentWillMount() {
    const { markers } = this.props;
    const hours = {};

    markers.map((parking) => {
      hours[parking.UUID] = 1;
    });

    this.setState({ hours });
  }

  handleHours = (id, value) => {
    const hours = this.state.hours;
    hours[id] = value;

    this.setState({ hours: hours });
    // this.setState({ hours: value });
  };

  getPrediction = (id, timestamp) => {
    // console.log(timestamp);
    var dateString = timestamp,
      dateTimeParts = dateString.split(" "),
      timeParts = dateTimeParts[1].split(":"),
      dateParts = dateTimeParts[0].split("-"),
      date;

    date = new Date(
      dateParts[0],
      parseInt(dateParts[1], 10) - 1,
      dateParts[2],
      timeParts[0],
      timeParts[1]
    );

    console.log(date); //Tue Sep 17 2013 10:08:00 GMT-0400

    // date = date.getHours(date.getHours() + 2);
    var start_time = date.setMinutes(date.getMinutes() - 5);
    var end_time = date.setMinutes(date.getMinutes() + 5);

    fetch(USERS_API + "/lots-prediction", {
      method: "post",
      body: JSON.stringify({
        parking_id: id,
        startTimestamp: start_time,
        endTimestamp: end_time,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          console.log(response.json());
          console.log("ERRORRRR!");
          return undefined;
        }
      })
      .then((data) => {
        let result = data.values;
        console.log(result[0].percentage);
        this.setState({ predictionResult: result[0].percentage });
      })
      .catch((err) => {
        throw err;
      });
  };

  getLots = (id) => {
    fetch(API + "/lots/" + id, {
      method: "get",
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          console.log(response.json());
          console.log("ERRORRRR!");
          return undefined;
        }
      })
      .then((data) => {
        let result = data.values;
        result.filter((value) => value.status === 0).length;
        this.setState({ activeLots: result });
      })
      .catch((err) => {
        throw err;
      });
  };

  renderParking = (item) => {
    const { hours } = this.state;
    const totalPrice = parseInt(item.price) * hours[item.UUID];

    return (
      <TouchableWithoutFeedback
        key={`parking-${item.UUID}`}
        // onPress={() => this.setState({ active: item.UUID })}
      >
        <View style={[styles.parking, styles.shadow]}>
          <View style={styles.hours}>
            <Text style={styles.hoursTitle}>{item.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {this.renderHours(item.UUID)}
              <Text style={{ color: markerTheme.COLORS.gray }}>hrs</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  activeModal: item,
                  futureModalVisibility: true,
                })
              }
            >
              <Text style={{ color: "blue" }}>Check Future Availability</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.parkingInfoContainer}>
            <View style={styles.parkingInfo}>
              <View style={styles.parkingIcon}>
                <Ionicons
                  name="md-pricetag"
                  size={markerTheme.SIZES.icon * 1.3}
                  color={markerTheme.COLORS.gray}
                />
                <Text style={{ marginLeft: markerTheme.SIZES.base }}>
                  £{item.price}
                </Text>
              </View>
              <View style={styles.parkingIcon}>
                <Ionicons
                  name="md-checkmark-circle"
                  size={markerTheme.SIZES.icon * 1.3}
                  color={markerTheme.COLORS.green}
                />
                <Text style={{ marginLeft: markerTheme.SIZES.base }}>
                  {item.free}
                </Text>
              </View>
            </View>
            <Button
              gradient
              style={styles.buy}
              onPress={() =>
                this.setState({ activeModal: item, modalVisibility: true })
              }
            >
              <View style={styles.buyTotal}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome
                    name="gbp"
                    size={markerTheme.SIZES.icon * 1.5}
                    color={markerTheme.COLORS.white}
                  />
                  <Text style={styles.buyTotalPrice}>{totalPrice}</Text>
                </View>
                <Text style={styles.calculation}>
                  {item.price}x{hours[item.UUID]} hrs
                </Text>
              </View>

              <View style={styles.buyBtn}>
                <FontAwesome
                  name="angle-right"
                  size={markerTheme.SIZES.icon * 1.75}
                  color={markerTheme.COLORS.white}
                />
              </View>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderParkings = (parkings) => {
    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToAlignment="center"
        style={styles.parkings}
        data={this.props.markers}
        keyExtractor={(item, index) => `${item.UUID}`}
        renderItem={({ item }) => this.renderParking(item)}
        ref={(ref) => {
          this.flatListRef = ref;
        }}
      />
    );
  };
  scrollToIndex = (selectedIndex) => {
    this.flatListRef.scrollToIndex({ animated: true, index: selectedIndex });
  };
  renderMondalHeader(activeModal) {
    return (
      <View>
        <View>
          <Text
            style={{
              fontSize: markerTheme.SIZES.font * 1.5,
              fontWeight: "400",
            }}
          >
            {activeModal.name}
          </Text>
        </View>
        <View style={{ paddingVertical: markerTheme.SIZES.base }}>
          <Text
            style={{
              color: markerTheme.COLORS.gray,
              fontSize: markerTheme.SIZES.font * 1.1,
            }}
          >
            {activeModal.address}
          </Text>
        </View>
        <View style={styles.modalInfo}>
          <View style={[styles.parkingIcon, { justifyContent: "flex-start" }]}>
            <Ionicons
              name="md-car"
              size={markerTheme.SIZES.icon * 1.6}
              color={markerTheme.COLORS.gray}
            />
            <Text style={{ fontSize: markerTheme.SIZES.icon * 1.15 }}>
              {" "}
              {
                this.state.activeLots.filter((item) => item.status === "0")
                  .length
              }
              /{activeModal.spots}
            </Text>
          </View>
          <View style={[styles.parkingIcon, { justifyContent: "flex-start" }]}>
            <Ionicons
              name="md-pricetag"
              size={markerTheme.SIZES.icon * 1.4}
              color={markerTheme.COLORS.gray}
            />
            <Text style={{ fontSize: markerTheme.SIZES.icon * 1.15 }}>
              {" "}
              £{activeModal.price}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  renderFutureModal() {
    const { futureModalVisibility, activeModal } = this.state;
    if (!futureModalVisibility) return null;
    return (
      <Modal
        isVisible
        useNativeDriver
        transparent={true}
        animanimationType="fade"
        // visible={futureModalVisibility}
        style={styles.modalContainer}
        backdropColor={markerTheme.COLORS.overlay}
        onBackButtonPress={() =>
          this.setState({ futureModalVisibility: false })
        }
        onBackdropPress={() => this.setState({ futureModalVisibility: false })}
        onSwipeComplete={() => this.setState({ futureModalVisibility: false })}
      >
        <View style={styles.modal}>
          {this.renderMondalHeader(activeModal)}
          <View style={styles.datePicker}>
            <DatePicker
              style={{ width: 200 }}
              date={this.state.date}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate="2016-05-01"
              maxDate="2050-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  marginLeft: 0,
                  height: 44,
                },
                dateInput: {
                  marginLeft: 36,
                  height: 44,
                },
                dateText: {
                  fontSize: 23,
                },
              }}
              onDateChange={(date) => {
                this.setState({ date: date });
              }}
            />
          </View>
          <View style={styles.timePicker}>
            <DatePicker
              style={{ width: 200 }}
              date={this.state.time}
              mode="time"
              placeholder="select time"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  // top: 4,
                  marginLeft: 0,
                  height: 44,
                },
                dateInput: {
                  marginLeft: 36,
                  height: 44,
                },
                dateText: {
                  fontSize: 23,
                },
              }}
              onDateChange={(time) => {
                this.setState({ time: time });
              }}
            />
          </View>
          {/* {console.log(this.state.date + " " + this.state.time + ":00")} */}
          <Button
            transparent
            style={styles.predictAvailabilityBtn}
            onPress={() =>
              this.getPrediction(
                activeModal.UUID,
                this.state.date + " " + this.state.time + ":00"
              )
            }
          >
            <Text style={styles.predictAvailabilityText}>
              Predict Availability
            </Text>
          </Button>
          <View style={styles.payBtnContainer}>
            <Text style={styles.predictedTitle}>
              Predicted Number of Available Spots
            </Text>
            <Button style={styles.predictedBtn}>
              <Text style={styles.predictedSlots}>
                {parseFloat(this.state.predictionResult) * activeModal.spots}
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }

  renderModal() {
    const { modalVisibility, activeModal, hours } = this.state;
    if (!activeModal) return null;
    this.getLots(activeModal.UUID);
    return (
      <View>
        {modalVisibility && (
          <Modal
            // isVisible
            useNativeDriver
            transparent={true}
            animanimationType="fade"
            visible={modalVisibility}
            style={styles.modalContainer}
            backdropColor={markerTheme.COLORS.overlay}
            onBackButtonPress={() => this.setState({ modalVisibility: false })}
            onBackdropPress={() => this.setState({ modalVisibility: false })}
            onSwipeComplete={() => this.setState({ modalVisibility: false })}
          >
            <View style={styles.modal}>
              {this.renderMondalHeader(activeModal)}
              <ScrollView>
                <View style={styles.tableContainer}>
                  <Text style={styles.modalHeading2}>
                    Available Parking Slots
                  </Text>
                  <ScrollView horizontal={true}>
                    <View>
                      <Table
                        borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
                      >
                        <Row
                          data={this.state.tableHead}
                          widthArr={this.state.widthArr}
                          style={styles.tableHeader}
                          textStyle={styles.tableHeaderText}
                        />
                      </Table>
                      <ScrollView style={styles.tableDataWrapper}>
                        <Table
                          borderStyle={{
                            borderWidth: 1,
                            borderColor: "#C1C0B9",
                          }}
                        >
                          {this.renderTableData()}
                        </Table>
                      </ScrollView>
                    </View>
                  </ScrollView>
                </View>
                <View style={styles.imageContainer}>
                  <Text
                    style={{
                      fontSize: markerTheme.SIZES.font * 1.5,
                      fontWeight: "700",
                      marginBottom: 20,
                      color: "#5a5a5a",
                    }}
                  >
                    Map View
                  </Text>
                  <Image
                    source={require("../assets/images/parking-slots.jpg")}
                    resizeMode="contain"
                    style={{ width, height: 200, overflow: "visible" }}
                  />
                </View>
                <View style={styles.payBtnContainer}>
                  <Button gradient style={styles.payBtn}>
                    <Text style={styles.payText}>
                      You will pay £
                      {activeModal.price * hours[activeModal.UUID]}
                      {"  "}
                    </Text>
                    <FontAwesome
                      name="angle-right"
                      size={markerTheme.SIZES.icon * 1.75}
                      color={markerTheme.COLORS.white}
                    />
                  </Button>
                </View>
              </ScrollView>
            </View>
          </Modal>
        )}
      </View>
    );
  }

  renderTableData() {
    return this.state.activeLots.map((tableRow, index) => {
      return (
        <Row
          key={index}
          data={[tableRow.lotNo, tableRow.status === "1" ? "Busy" : "Empty"]}
          widthArr={this.state.widthArr}
          style={[
            styles.tableRow,
            parseInt(tableRow.status) && { backgroundColor: "#ececec" },
          ]}
          textStyle={styles.tableText}
        />
      );
    });
  }
  renderHours(id) {
    const { hours } = this.state;
    const availableHours = [1, 2, 3, 4, 5, 6];

    return (
      <Dropdown
        defaultIndex={0}
        options={availableHours}
        style={styles.hoursDropdown}
        defaultValue={`0${hours[id]}:00` || "01:00"}
        dropdownStyle={styles.hoursDropdownStyle}
        onSelect={(index, value) => this.handleHours(id, value)}
        renderRow={(option) => (
          <Text style={styles.hoursDropdownOption}>{`0${option}:00`}</Text>
        )}
        renderButtonText={(option) => `0${option}:00`}
      />
    );
  }

  convertObjects = (data) => {
    var output = data.map(function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    });
    this.setState({ lotsTableData: output });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          region={this.props.region}
          showsUserLocation={true}
          // onRegionChange={(reg) => this.props.onRegionChange(reg)}
        >
          <Marker coordinate={this.props.region} pinColor="purple" />
          {this.props.markers.map((marker) => (
            <Marker
              key={marker.UUID}
              coordinate={{
                latitude: parseFloat(marker.lat),
                longitude: parseFloat(marker.long),
              }}
              pinColor={
                parseInt(marker.free) > 0
                  ? theme.colors.secondary
                  : markerTheme.COLORS.red
              }
              onPress={() =>
                this.scrollToIndex(this.props.markers.indexOf(marker))
              }
              // onCalloutPress={() =>
              //   this.scrollToIndex(this.props.markers.indexOf(marker))
              // }
            >
              <Callout tooltip>
                <TouchableOpacity
                  onPress={() => this.setState({ active: marker.UUID })}
                >
                  <View
                    style={[
                      styles.marker,
                      styles.shadow,
                      this.state.active === marker.UUID ? styles.active : null,
                    ]}
                  >
                    <Text style={styles.markerTitle}>{marker.name}</Text>
                    <Text style={styles.markerStatus}>
                      {" "}
                      ({marker.free} / {marker.spots})
                    </Text>
                  </View>
                </TouchableOpacity>
              </Callout>
            </Marker>
          ))}
        </MapView>
        {this.renderParkings()}
        {this.renderModal()}
        {this.renderFutureModal()}
      </View>
    );
  }
}
export default MyMapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: markerTheme.COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: markerTheme.SIZES.base * 2,
    paddingTop: markerTheme.SIZES.base * 2.5,
    paddingBottom: markerTheme.SIZES.base * 1.5,
  },
  headerTitle: {
    color: markerTheme.COLORS.gray,
  },
  headerLocation: {
    fontSize: markerTheme.SIZES.font,
    fontWeight: "500",
    paddingVertical: markerTheme.SIZES.base / 3,
  },

  parkings: {
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 20,
    paddingBottom: markerTheme.SIZES.base * 2,
  },
  parking: {
    flexDirection: "row",
    backgroundColor: markerTheme.COLORS.white,
    borderRadius: 6,
    marginHorizontal: markerTheme.SIZES.base * 2,
    width: width - 24 * 2,
    height: 150,
  },
  buy: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 6,
    width: 100,
    height: 150 - markerTheme.SIZES.base * 3,
    paddingRight: markerTheme.SIZES.base,
  },
  buyTotal: {
    paddingLeft: 8,
    flex: 1,
    justifyContent: "space-evenly",
  },
  buyTotalPrice: {
    color: markerTheme.COLORS.white,
    fontSize: markerTheme.SIZES.base * 2.5,
    fontWeight: "700",
    paddingLeft: markerTheme.SIZES.base * 1.2,
  },
  calculation: {
    color: markerTheme.COLORS.white,
    fontSize: markerTheme.SIZES.base * 1.7,
  },
  buyBtn: {
    // flex: 0.5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  marker: {
    flexDirection: "row",
    backgroundColor: markerTheme.COLORS.white,
    borderRadius: markerTheme.SIZES.base * 2,
    paddingVertical: 12,
    paddingHorizontal: markerTheme.SIZES.base * 2,
    borderWidth: 1,
    borderColor: markerTheme.COLORS.red,
  },
  markerTitle: {
    color: markerTheme.COLORS.gray,
    fontWeight: "bold",
    fontSize: 16,
  },
  markerStatus: {
    color: markerTheme.COLORS.red,
    fontWeight: "bold",
    fontSize: 16,
  },
  shadow: {
    shadowColor: markerTheme.COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  active: {
    borderColor: markerTheme.COLORS.black,
  },
  hours: {
    flex: 1,
    flexDirection: "column",
    marginLeft: markerTheme.SIZES.base / 2,
    justifyContent: "space-evenly",
    paddingLeft: markerTheme.SIZES.base,
  },
  hoursTitle: {
    fontSize: markerTheme.SIZES.text,
    fontWeight: "500",
  },
  hoursDropdown: {
    borderRadius: markerTheme.SIZES.base / 2,
    borderColor: markerTheme.COLORS.overlay,
    borderWidth: 1,
    padding: markerTheme.SIZES.base,
    marginRight: markerTheme.SIZES.base / 2,
  },
  hoursDropdownOption: {
    fontSize: markerTheme.SIZES.font * 0.8,
    padding: markerTheme.SIZES.base,
  },
  hoursDropdownStyle: {
    borderRadius: markerTheme.SIZES.base / 2,
    borderColor: markerTheme.COLORS.overlay,
    borderWidth: 1,
    marginLeft: -markerTheme.SIZES.base,
    marginVertical: -(markerTheme.SIZES.base + 1),
  },
  parkingInfoContainer: { flex: 1.5, flexDirection: "row" },
  parkingInfo: {
    justifyContent: "space-evenly",
    marginHorizontal: markerTheme.SIZES.base * 1.5,
  },
  parkingIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modal: {
    flexDirection: "column",
    height: height * 0.75,
    padding: markerTheme.SIZES.base * 2,
    backgroundColor: markerTheme.COLORS.white,
    borderTopLeftRadius: markerTheme.SIZES.base,
    borderTopRightRadius: markerTheme.SIZES.base,
  },
  modalInfo: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: markerTheme.SIZES.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: markerTheme.COLORS.overlay,
    borderBottomColor: markerTheme.COLORS.overlay,
  },
  modalHours: {
    paddingVertical: height * 0.11,
  },
  modalHoursDropdown: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: markerTheme.SIZES.base,
  },
  payBtn: {
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    padding: markerTheme.SIZES.base * 1.5,
  },
  payText: {
    fontWeight: "600",
    fontSize: markerTheme.SIZES.base * 1.5,
    color: markerTheme.COLORS.white,
  },
  payBtnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  markerPrice: { color: markerTheme.COLORS.red, fontWeight: "bold" },
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeader: { height: 50, backgroundColor: theme.colors.primary },
  tableHeaderText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 24,
    margin: 6,
    color: markerTheme.COLORS.white,
  },
  tableText: {
    textAlign: "center",
    fontWeight: "100",
    margin: 6,
    fontWeight: "700",
    fontSize: 20,
  },
  tableDataWrapper: { marginTop: -1 },
  tableRow: { height: 40, flexDirection: "row" },
  imageContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: markerTheme.COLORS.overlay,
  },
  futureContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: markerTheme.COLORS.overlay,
  },
  datePicker: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    marginTop: 20,
  },
  timePicker: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  modalHeading2: {
    fontSize: markerTheme.SIZES.font * 1.5,
    fontWeight: "700",
    marginBottom: 20,
    color: "#5a5a5a",
    textAlign: "center",
  },
  predictAvailabilityBtn: {},
  predictAvailabilityText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: markerTheme.COLORS.black,
    textDecorationLine: "underline",
  },
  predictedSlots: {
    fontSize: 50,
    fontWeight: "700",
    color: markerTheme.COLORS.black,
  },
  predictedBtn: {
    // backgroundColor: "#EC2121",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#EC2121",
    marginTop: 20,
  },
  predictedTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: markerTheme.COLORS.overlay,
    color: markerTheme.COLORS.black,
  },
});
