package se.skb.skbdoc.skbdocument;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import se.skb.skbdoc.util.DocumentumSession;

import com.documentum.fc.client.IDfSysObject;
import com.documentum.fc.common.DfId;
import com.documentum.fc.common.DfLogger;
import com.documentum.fc.common.IDfId;

public class SkbDocumentServlet extends HttpServlet {
	
	
	private static final long serialVersionUID = 1L;

	/**
	 * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
	 * methods.
	 * 
	 * @param request
	 *            servlet request
	 * @param response
	 *            servlet response
	 * @throws ServletException
	 *             if a servlet-specific error occurs
	 * @throws IOException
	 *             if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		ServletOutputStream out = response.getOutputStream();
		DocumentumSession dSession = new DocumentumSession();
		
		try {
			// Get id
			String idStr = (String) request.getParameter("id");
			IDfId id = new DfId(idStr);
			
			if (id.isObjectId()) {
				IDfSysObject obj = (IDfSysObject) dSession.getSession().getObject(id);

				//prepare response headers
				response.setContentType(obj.getFormat().getMIMEType());
				response.setContentLength( (int) obj.getContentSize() );
				response.setHeader( "Content-Disposition", "attachment; filename=\"" + obj.getObjectName() + "." + obj.getFormat().getDOSExtension() + "\"" );
				
				//write content
				ByteArrayInputStream in = obj.getContent();
		        byte[] bbuf = new byte[256];
		        int length = 0;
		        while ((in != null) && ((length = in.read(bbuf)) != -1))
		        {
		        	out.write(bbuf,0,length);
		        }
	
				
			} else {
				out.println("Invalid id");
			}
			
		} catch (Throwable ex) {
			DfLogger.error(this, "", null, ex);
			out.println(ex.toString());
		} finally {
			out.flush();
			out.close();
			if (dSession != null) {
				dSession.disconnectFromDocbase();
			}
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		processRequest(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		processRequest(req, resp);
	}
}
