/* @flow */
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { withNavigation } from "react-navigation";
import type {
  DeviceInfo,
  FirmwareUpdateContext,
} from "@ledgerhq/live-common/lib/types/manager";
import manager from "@ledgerhq/live-common/lib/manager";
import LText from "../../components/LText";
import colors from "../../colors";
import Button from "../../components/Button";

type Props = {
  navigation: *,
  deviceInfo: DeviceInfo,
  deviceId: string,
};

type State = {
  firmware: ?FirmwareUpdateContext,
  visibleFirmwareModal: boolean,
  step: string,
};

class FirmwareUpdateRow extends PureComponent<Props, State> {
  state = {
    visibleFirmwareModal: false,
    firmware: null,
    step: "",
  };

  unmount = false;

  async componentDidMount() {
    const { deviceInfo, deviceId, navigation } = this.props;
    const firmware = await manager.getLatestFirmwareForDevice(deviceInfo);

    if (this.unmount) return;
    if (deviceInfo.isOSU) {
      navigation.navigate("FirmwareUpdateMCU", {
        deviceId,
        firmware,
      });
    } else {
      this.setState({ firmware });
    }
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  onUpdatePress = () => {
    const { navigation, deviceId } = this.props;
    const { firmware } = this.state;
    if (!firmware) return;
    navigation.navigate("FirmwareUpdate", {
      deviceId,
      firmware,
    });
  };

  render() {
    const { firmware } = this.state;
    if (!firmware) {
      return null;
    }

    return (
      <View style={styles.root}>
        <LText semiBold numberOfLines={1} style={styles.title}>
          <Trans
            i18nKey="FirmwareUpdateRow.title"
            values={{
              version: manager.getFirmwareVersion(firmware.osu),
            }}
          />
        </LText>
        <Button
          type="primary"
          event="FirmwareUpdate"
          title={<Trans i18nKey="FirmwareUpdateRow.action" />}
          onPress={this.onUpdatePress}
        />
      </View>
    );
  }
}

export default withNavigation(FirmwareUpdateRow);

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    alignSelf: "stretch",
    flexDirection: "column",
  },
  title: {
    color: colors.live,
    fontSize: 14,
    padding: 16,
    alignSelf: "center",
  },
  button: {},
});
