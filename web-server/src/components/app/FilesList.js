import { Link } from "react-router-dom"
import { humanFileSize } from "../../utils";
import { forwardRef, useContext } from "react";
import { Dropdown } from "react-bootstrap";

import * as Api from "../../api/Api"
import { ApiContext } from "../../providers/ApiProvider";

export default function FilesList({ files, onFileChange }) {
    const { refreshTransfers } = useContext(ApiContext)

    const CustomToggle = forwardRef(({ children, onClick }, ref) => (
        <button className="btn" ref={ref} onClick={(e) => { e.preventDefault(); onClick(e) }}>
            <i className="bi bi-three-dots-vertical"></i>
        </button>
    ))

    const onDeleteFile = async (file) => {
        await Api.deleteTransferFile(file.transferId, file.id)
        await refreshTransfers()
        onFileChange()
    }

    const FilesListEntry = ({ file }) => {
        return (
            <tr>
                <td scope="row" style={{ padding: 0 }}>
                    <Link className="list-group-item list-group-item-action p-2">
                        {file.info.name}
                        {/* <span className="me-2">{file.name || file.id}</span>
                        <small className="text-body-secondary">{file.files.length} files</small> */}
                    </Link>
                </td>
                <td>
                    <small>{humanFileSize(file.info.size, true)}</small>
                </td>
                <td>
                    <small>{file.info.type}</small>
                </td>
                <td>
                    {/* <small className="text-body-secondary">Uploading...</small> */}
                </td>
                <td className="text-end" style={{ padding: 0 }}>
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} />

                        <Dropdown.Menu className="text-small shadow">
                            <Dropdown.Item>Rename</Dropdown.Item>
                            <Dropdown.Item>Preview</Dropdown.Item>
                            <Dropdown.Item onClick={() => { Api.downloadTransferFile(file.transferId, file.id) }}>Download</Dropdown.Item>
                            <Dropdown.Divider></Dropdown.Divider>
                            <Dropdown.Item className="text-danger" onClick={() => onDeleteFile(file)}>
                                Remove
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        )
    }

    return (
        <div className="FilesList" style={{ maxWidth: "800px" }}>

            <table className="table table-hover table-responsive border">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Size</th>
                        <th scope="col">Type</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {files.length == 0 && (
                        <tr>
                            <td scope="row" className="bg-dark-subtle">
                                <small>No files</small>
                            </td>
                            <td className="bg-dark-subtle">
                            </td>
                            <td className="bg-dark-subtle">
                            </td>
                            <td className="bg-dark-subtle">
                            </td>
                            <td className="bg-dark-subtle">
                            </td>
                        </tr>
                    )}
                    {files.map(f => {
                        return <FilesListEntry key={f.id} file={f} />
                    })}
                </tbody>
            </table>
        </div>
    )
}