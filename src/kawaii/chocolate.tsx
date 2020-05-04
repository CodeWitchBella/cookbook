import React from 'react'
import type { KawaiiMood } from 'react-kawaii'
import { View, ViewStyle } from 'react-native'
import { KawaiiFace } from './kawaii-face'
import { Svg, G, Path } from 'react-native-svg'

const paths = {
  choco_background:
    'M114 206a4 4 0 01-4 4H4a4 4 0 01-4-4V4a4 4 0 014-4h106a4 4 0 014 4v202z',
  choco_inner_1:
    'M15 8h-5a2 2 0 00-2 2v30a2 2 0 002 2h41a2 2 0 002-2V10a2 2 0 00-2-2H15zm28 26a2 2 0 002-2V18a2 2 0 00-2-2H18a2 2 0 00-2 2v14a2 2 0 002 2h25z',
  choco_inner_2:
    'M68 8h-5a2 2 0 00-2 2v30a2 2 0 002 2h41a2 2 0 002-2V10a2 2 0 00-2-2H68zm28 26a2 2 0 002-2V18a2 2 0 00-2-2H71a2 2 0 00-2 2v14a2 2 0 002 2h25z',
  choco_inner_3:
    'M15 50h-5a2 2 0 00-2 2v30a2 2 0 002 2h41a2 2 0 002-2V52a2 2 0 00-2-2H15zm28 26a2 2 0 002-2V60a2 2 0 00-2-2H18a2 2 0 00-2 2v14a2 2 0 002 2h25z',
  choco_inner_4:
    'M68 50h-5a2 2 0 00-2 2v30a2 2 0 002 2h41a2 2 0 002-2V52a2 2 0 00-2-2H68zm28 26a2 2 0 002-2V60a2 2 0 00-2-2H71a2 2 0 00-2 2v14a2 2 0 002 2h25z',
  choco_inner_5:
    'M15 92h-5a2 2 0 00-2 2v30a2 2 0 002 2h41a2 2 0 002-2V94a2 2 0 00-2-2H15zm28 26a2 2 0 002-2v-14a2 2 0 00-2-2H18a2 2 0 00-2 2v14a2 2 0 002 2h25z',
  choco_inner_6:
    'M68 92h-5a2 2 0 00-2 2v30a2 2 0 002 2h41a2 2 0 002-2V94a2 2 0 00-2-2H68zm28 26a2 2 0 002-2v-14a2 2 0 00-2-2H71a2 2 0 00-2 2v14a2 2 0 002 2h25z',
  paper: 'M0 125l114-32.5V207a4 4 0 01-4 4H4a4 4 0 01-4-4v-82z',
  paper_folded: 'M0 125.016h102.305L114 92.5 0 125.016z',
}

export function KawaiiChocolate({
  size = 320,
  color = '#fc105c',
  mood = 'blissful',
  style,
}: {
  size?: number
  color?: string
  mood?: KawaiiMood
  style?: ViewStyle
}) {
  return (
    <View style={[{ position: 'relative' }, style]}>
      <Svg width={size * 0.54} height={size} fill="none" viewBox="0 0 114 211">
        <G id="chocolate">
          <Path id="body" fill="#8E5434" d={paths.choco_background}></Path>
          <G id="bars">
            <G id="choco-inner_1">
              <Path
                id="Union"
                fill="#fff"
                fillOpacity="0.1"
                fillRule="evenodd"
                d={paths.choco_inner_1}
                clipRule="evenodd"
              ></Path>
            </G>
            <G id="choco-inner_2">
              <Path
                id="Union_2"
                fill="#fff"
                fillOpacity="0.1"
                fillRule="evenodd"
                d={paths.choco_inner_2}
                clipRule="evenodd"
              ></Path>
            </G>
            <G id="choco-inner_3">
              <Path
                id="Union_3"
                fill="#fff"
                fillOpacity="0.1"
                fillRule="evenodd"
                d={paths.choco_inner_3}
                clipRule="evenodd"
              ></Path>
            </G>
            <G id="choco-inner_4">
              <Path
                id="Union_4"
                fill="#fff"
                fillOpacity="0.1"
                fillRule="evenodd"
                d={paths.choco_inner_4}
                clipRule="evenodd"
              ></Path>
            </G>
            <G id="choco-inner_5">
              <Path
                id="Union_5"
                fill="#fff"
                fillOpacity="0.1"
                fillRule="evenodd"
                d={paths.choco_inner_5}
                clipRule="evenodd"
              ></Path>
            </G>
            <G id="choco-inner_6">
              <Path
                id="Union_6"
                fill="#fff"
                fillOpacity="0.1"
                fillRule="evenodd"
                d={paths.choco_inner_6}
                clipRule="evenodd"
              ></Path>
            </G>
          </G>
          <G id="Group 15">
            <Path id="paper" fill={color} d={paths.paper}></Path>
            <G id="paper-folded">
              <Path id="Vector" fill={color} d={paths.paper_folded}></Path>
              <Path
                id="Vector_2"
                fill="#000"
                fillOpacity="0.15"
                d="M0 125.016h102.305L114 92.5 0 125.016z"
              ></Path>
            </G>
          </G>
        </G>
        <KawaiiFace mood={mood} transform="translate(25 150)" />
      </Svg>
    </View>
  )
}
