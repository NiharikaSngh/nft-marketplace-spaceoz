import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import photo from "./search.png";
import fil from "./filter.png";
import face from "./face.png";
import caret from "./caret-down.png";
import random from "./random.png";
import vector from "./vector.png";
import Appbar from "./components/Appbar";
import TrendShip from "./TrendShip";
import Img from "./Img.png";
import {
  buyItemWithSPZ,
  buyItemWithXTZ,
  getActiveAccount,
  getInventoryContractStorage,
} from "./adapters/tezos";
import { bytes2Char } from "@taquito/utils";
import { packDataBytes, unpackDataBytes } from "@taquito/michel-codec";

export default function Inventory() {
  const [ships, setShips] = useState([]);
  const [bullets, setBullets] = useState([]);
  useEffect(() => {
    getGameData();
  }, []);

  const handleBuyXTZ = async (bullet) => {
    await buyItemWithXTZ(bullet.price, bullet.token_id);
  };
  const handleBuySPZ = async (bullet) => {
    await buyItemWithSPZ(bullet.price / 10000, bullet.token_id);
  };

  const getGameData = () => {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8];

    getInventoryContractStorage().then((storage) => {
      const meta = storage.token_metadata;
      ids.forEach((item) => {
        storage.ledger.get(`${item}`).then((l) =>
          meta.get(`${item}`).then((result) => {
            const src = { bytes: result.token_info.get("price") };
            const typ = {
              prim: "nat",
            };
            const _data = {
              name: bytes2Char(result.token_info.get("name")),
              url: bytes2Char(result.token_info.get("url")),
              price: parseInt(unpackDataBytes(src, typ).int),
              token_id: item,
              owners: l.length,
            };
            if (item < 6) {
              setShips((ships) => [...ships, _data]);
            } else {
              setBullets((bullets) => [...bullets, _data]);
            }
            console.log(_data);
          })
        );
      });
    });
  };
  const[alarm, setAlarm] = useState("true");
  console.log(alarm);
  return (
    <div className="inven-page" style={{'--default': alarm===false ? '#6e6e6e' : null}}>
      <div className="left">
        <Navbar stateChanger={setAlarm} notify={alarm}/>
      </div>
      <div className="right" style={{backgroundColor: alarm===false ? '#f5f4fc' : null}}>
        <div className="Top">
          <div className="input-div">
            <img className="hold1" src={photo} alt="not" />
            <input
              className="tag-input"
              type="text"
              placeholder="Search Nfts..."
            />
            <img className="hold2" src={fil} alt="not" />
          </div>
          <Appbar />
        </div>
        <div className="Middle">
          <span className="Heading" style={{color: alarm===false ? "black" : null }}>Trending Warships</span>
          <div className="card-begin">
            {ships.map((e) => (
              <TrendShip key={e.token_id} ship={e} />
            ))}
            <TrendShip value="true" />
            <TrendShip value="true" />
          </div>
        </div>
        <div className="table-start" style={{backgroundColor: alarm===false ? "#f5f4fc" : null }}>
          <span className="Headin" style={{color: alarm===false ? "black" : null }}>Top Upgrades</span>
          <div className="table-box">
            <table>
              <thead>
                <tr>
                  <th className="hide">SNo</th>
                  <th className="down">Collection</th>
                  <th>Damage</th>
                  <th>Buy</th>
                  <th>Owners</th>
                </tr>
              </thead>
              <tbody>
                {bullets.map((e, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td className="mak-flex">
                      <img className="fix" src={e.url} alt="no"></img>
                      <p>{e.name}</p>
                    </td>
                    <td>
                      <div className="btn-grp">-20% Health</div>
                    </td>
                    <td>
                      <div className="btn-grp">
                        <button className="tez" onClick={() => handleBuyXTZ(e)}>
                          {e.price / 1000000} XTZ
                        </button>
                        <button className="orz" onClick={() => handleBuySPZ(e)}>
                          {e.price / 10000} SPZ
                        </button>
                      </div>
                    </td>
                    <td>{e.owners}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}  
