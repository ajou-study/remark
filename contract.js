/**
 * @author Jang Seongho
 * 
 * @constant
 * @type { function }
 * 
 * @description
 * NFT를 구매하는 함수입니다. 성공적으로 구매하면 true, 실패하면 false가 반환됩니다.
 * 이더리움 네트워크 특성 상, 거래 처리에 10 ~ 20초 걸립니다.
 * 
 * @param { eth } eth - recoil에 있는 ethState를 넣어주시면 됩니다.
 * @param { String } collectionName 
 * 컬렉션 이름을 넣어주면 됩니다. datas/enum/collection_name_enum.js에 선언되어 있는 CollectionNameEnum 객체를 사용하시면 됩니다.
 * @param { String } nftId - 문자열로 nft id를 입력해주시면 됩니다.
 * @param { String } owner - 문자열로 NFT 소유자의 지갑 주소를 입력해주시면 됩니다.
 * @param { String } price - 문자열로 NFT 가격을 입력해주시면 됩니다.
 * @returns { boolean }
 * true - 거래 성공
 * false - 거래 실패
 * 
 * @example
 * ```js
 * const { ethState, setEthState } = useEth();
 * 
 * buyNft(ethState, CollectionNameEnum.LACK_OF_SLEEP_LAMA, "1", "0xqweqasdz1231212", "100").then((result) => {
 *      if(result) {
 *          // 거래 성공시 처리 로직
 * 
 *          return;
 *      }
 * 
 *      // 거래 실패시 처리 로직
 * });
 * ```
 * 
 * @throws { Error } 잔고가 부족하다던가, NFT가 없다던가 등의 이유로 거래 시도 자체가 거절된 경우
 */
export const buyNft = async (eth, collectionName, nftId, owner, price) => {
    return new Promise(async (resolve, reject) => {
        const ERC1155TokenContract = isExistERC1155TokenByCollectionName(eth, collectionName);


        if (ERC1155TokenContract === undefined) {
            reject(new Error(`Not exist nft, collection name is ${collectionName}`));

            return;
        }

        const balanceOfNft = await ERC1155TokenContract.methods
            .balanceOf(owner, nftId)
            .call();

        assert(balanceOfNft > 0, "The balance of nft is 0");

        try {
            const nonceResult = await checkNonce();
            const nonce = nonceResult.data;
            const ownerInfo = eth.web3.eth.accounts.privateKeyToAccount('e7a36cc7c2c6aa2c49be21b5a8516982fce19e4337f3c0b56f73a401800eb1cf');

            var dataTx = await ERC1155TokenContract.methods.safeTransferFrom(owner, eth.accounts[0], nftId, 1, "0x00").encodeABI();
            var estimateGas = await ERC1155TokenContract.methods.safeTransferFrom(owner, eth.accounts[0], nftId, 1, "0x00").estimateGas({ from: ownerInfo.address });

            var rawTx = {
                to: ERC1155TokenContract._address,
                from: ownerInfo.address,
                nonce: nonce,
                gas: estimateGas,
                gasLimit: estimateGas,
                gasPrice: eth.web3.utils.toWei('10', 'gwei'),
                data: dataTx,
                chainId: 5,
                value: 0,
            };

            const signTx = await eth.web3.eth.accounts.signTransaction(rawTx, ownerInfo.privateKey);
            eth.web3.currentProvider.send({
                method: 'eth_sendRawTransaction',
                params: [signTx.rawTransaction],
                jsonrpc: "2.0",
            }, (err, result) => {
                if (err) {
                    console.log("err");
                    return;
                }

                console.log(result);
            })
        } catch (e) {
            reject(new Error(`Can't send NFT from ${owner} to ${eth.accounts[0]}.`));
        }

    });
}
